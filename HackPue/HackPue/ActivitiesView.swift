//
//  ActivitiesView.swift
//  HackPue
//
//  Created by Liz Bello on 20/11/25.
//

import SwiftUI

struct ActivitiesView: View {
    @StateObject private var contentService = ContentService()
    @State private var activities: [Activity] = []
    @State private var selectedCategory: String = "Todas"
    
    let categories = ["Todas", "Al aire libre", "En casa", "Educativas", "Creativas"]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Actividades para compartir")
                            .font(.title).bold()
                        Text("Momentos de calidad sin pantallas")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top)
                    
                    // Filtros de categoría
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(categories, id: \.self) { category in
                                Button {
                                    selectedCategory = category
                                    loadActivities()
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
                            Text("Generando actividades con IA...")
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
                            
                            Text("Error al cargar actividades")
                                .font(.headline)
                            
                            Text(error)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal)
                            
                            Button("Reintentar") {
                                loadActivities()
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .padding()
                    }
                    // Lista de actividades
                    else if activities.isEmpty {
                        VStack(spacing: 15) {
                            Image(systemName: "figure.2.and.child.holdinghands")
                                .font(.system(size: 60))
                                .foregroundColor(.blue)
                            
                            Text("No hay actividades disponibles")
                                .font(.headline)
                            
                            Text("Toca el botón para generar actividades con IA")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                            
                            Button("Generar actividades") {
                                loadActivities()
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
                            ForEach(activities) { activity in
                                ActivityCard(activity: activity)
                            }
                        }
                        .padding(.horizontal)
                        
                        // Botón para regenerar
                        Button {
                            loadActivities()
                        } label: {
                            HStack {
                                Image(systemName: "arrow.clockwise")
                                Text("Generar nuevas actividades")
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
                if activities.isEmpty {
                    loadActivities()
                }
            }
        }
    }
    
    private func loadActivities() {
        Task {
            activities = await contentService.fetchActivities(category: selectedCategory, count: 10)
        }
    }
}

struct ActivityCard: View {
    let activity: Activity
    @State private var isExpanded = false
    
    // Convertir string de color a Color de SwiftUI
    private var activityColor: Color {
        switch activity.color.lowercased() {
        case "green": return .green
        case "blue": return .blue
        case "orange": return .orange
        case "purple": return .purple
        case "pink": return .pink
        case "red": return .red
        case "yellow": return .yellow
        default: return .blue
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header de la tarjeta
            HStack(spacing: 15) {
                ZStack {
                    Circle()
                        .fill(activityColor.opacity(0.2))
                        .frame(width: 50, height: 50)
                    
                    Image(systemName: activity.icon)
                        .font(.system(size: 24))
                        .foregroundColor(activityColor)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(activity.title)
                        .font(.headline)
                        .lineLimit(isExpanded ? nil : 2)
                    
                    HStack(spacing: 8) {
                        Label(activity.duration, systemImage: "clock")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text("•")
                            .foregroundColor(.secondary)
                        
                        Text(activity.ageRange)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Spacer()
                
                Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                    .foregroundColor(.secondary)
            }
            
            // Descripción expandible
            if isExpanded {
                Text(activity.description)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .transition(.opacity)
                
                // Badge de categoría
                HStack {
                    Text(activity.category)
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(activityColor.opacity(0.2))
                        .foregroundColor(activityColor)
                        .cornerRadius(12)
                    
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
    ActivitiesView()
}
