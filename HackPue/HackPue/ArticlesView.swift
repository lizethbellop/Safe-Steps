//
//  ArticlesView.swift
//  HackPue
//
//  Created by Liz Bello on 20/11/25.
//

import SwiftUI

struct ArticlesView: View {
    @StateObject private var contentService = ContentService()
    @State private var articles: [Article] = []
    @State private var selectedCategory: String = "Todas"
    
    let categories = ["Todas", "Riesgos", "Tendencias", "Consejos", "Noticias"]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Mantente informado")
                            .font(.title).bold()
                        Text("Tendencias y riesgos en seguridad digital")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top)
                    
                    // Filtros de categoría
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(categories, id: \.self) { category in
                                Button {
                                    selectedCategory = category
                                    loadArticles()
                                } label: {
                                    Text(category)
                                        .font(.subheadline)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(
                                            selectedCategory == category ? Color.blue : Color(.systemGray5)
                                        )
                                        .foregroundColor(
                                            selectedCategory == category ? .white : .primary
                                        )
                                        .cornerRadius(20)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Estado de carga
                    if contentService.isLoading {
                        VStack(spacing: 15) {
                            ProgressView()
                                .scaleEffect(1.5)
                            Text("Generando artículos con IA...")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 60)
                    }
                    // Error
                    else if let error = contentService.error {
                        VStack(spacing: 15) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.system(size: 50))
                                .foregroundColor(.orange)
                            
                            Text("Error al cargar artículos")
                                .font(.headline)
                            
                            Text(error)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal)
                            
                            Button("Reintentar") {
                                loadArticles()
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .padding()
                    }
                    // Lista de artículos
                    else if articles.isEmpty {
                        VStack(spacing: 15) {
                            Image(systemName: "newspaper.fill")
                                .font(.system(size: 60))
                                .foregroundColor(.blue)
                            
                            Text("No hay artículos disponibles")
                                .font(.headline)
                            
                            Text("Toca el botón para generar artículos con IA")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                            
                            Button("Generar artículos") {
                                loadArticles()
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .padding(.vertical, 60)
                        .padding(.horizontal)
                    }
                    else {
                        LazyVStack(spacing: 16) {
                            ForEach(articles) { article in
                                ArticleCard(article: article)
                            }
                        }
                        .padding(.horizontal)
                        
                        // Botón para regenerar
                        Button {
                            loadArticles()
                        } label: {
                            HStack {
                                Image(systemName: "arrow.clockwise")
                                Text("Generar nuevos artículos")
                            }
                            .font(.subheadline)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .cornerRadius(10)
                        }
                        .padding(.top, 10)
                    }
                }
                .padding(.bottom)
            }
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                if articles.isEmpty {
                    loadArticles()
                }
            }
        }
    }
    
    private func loadArticles() {
        Task {
            articles = await contentService.fetchArticles(category: selectedCategory, count: 12)
        }
    }
}

struct ArticleCard: View {
    let article: Article
    @State private var isExpanded = false
    
    // Convertir string de color a Color de SwiftUI
    private var articleColor: Color {
        switch article.color.lowercased() {
        case "red": return .red
        case "purple": return .purple
        case "blue": return .blue
        case "orange": return .orange
        case "indigo": return .indigo
        case "pink": return .pink
        case "green": return .green
        default: return .blue
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack(spacing: 15) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(articleColor.opacity(0.2))
                        .frame(width: 50, height: 50)
                    
                    Image(systemName: article.icon)
                        .font(.system(size: 24))
                        .foregroundColor(articleColor)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(article.title)
                        .font(.headline)
                        .lineLimit(isExpanded ? nil : 2)
                    
                    HStack(spacing: 8) {
                        Label(article.readTime, systemImage: "clock")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text("•")
                            .foregroundColor(.secondary)
                        
                        Text(article.date)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                    .foregroundColor(.secondary)
            }
            
            // Contenido expandible
            if isExpanded {
                Divider()
                
                Text(article.summary)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .transition(.opacity)
                
                HStack(spacing: 12) {
                    // Badge de categoría
                    Text(article.category)
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(articleColor.opacity(0.2))
                        .foregroundColor(articleColor)
                        .cornerRadius(12)
                    
                    // Fuente
                    HStack(spacing: 4) {
                        Image(systemName: "doc.text.fill")
                            .font(.caption)
                        Text(article.source)
                            .font(.caption)
                    }
                    .foregroundColor(.secondary)
                    
                    Spacer()
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 2)
        .onTapGesture {
            withAnimation(.spring()) {
                isExpanded.toggle()
            }
        }
    }
}

#Preview {
    ArticlesView()
}
