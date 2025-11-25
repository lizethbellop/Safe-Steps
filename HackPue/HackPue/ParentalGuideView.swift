//
//  ParentalGuideView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct ParentalGuideView: View {
    @State private var guideText: String = ""
    @State private var isLoading: Bool = false
    @State private var errorMessage: String?
    @StateObject private var geminiService = GeminiService()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Guía Parental")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                        
                        Text("Información sobre seguridad digital para niños")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)
                    .padding(.top)
                    
                    // Content area
                    if isLoading {
                        VStack(spacing: 16) {
                            ProgressView()
                                .scaleEffect(1.2)
                            Text("Generando guía personalizada...")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 60)
                    } else if let error = errorMessage {
                        VStack(spacing: 16) {
                            Image(systemName: "exclamationmark.triangle")
                                .font(.system(size: 48))
                                .foregroundColor(.red)
                            
                            Text("Error al cargar la guía")
                                .font(.headline)
                            
                            Text(error)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                            
                            Button("Reintentar") {
                                loadParentalGuide()
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .padding()
                    } else if !guideText.isEmpty {
                        VStack(alignment: .leading, spacing: 16) {
                            Text(guideText)
                                .font(.body)
                                .lineSpacing(6)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                                .padding(.horizontal)
                            
                            // Refresh button
                            Button("Generar nueva guía") {
                                loadParentalGuide()
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                            .padding(.horizontal)
                        }
                    } else {
                        // Initial state
                        VStack(spacing: 20) {
                            Image(systemName: "shield.lefthalf.filled")
                                .font(.system(size: 80))
                                .foregroundColor(.blue)
                            
                            Text("Protege a tus hijos en línea")
                                .font(.title2)
                                .fontWeight(.semibold)
                                .multilineTextAlignment(.center)
                            
                            Text("Obtén información personalizada sobre las amenazas digitales que enfrentan los niños de 5 a 15 años")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                            
                            Button("Generar guía") {
                                loadParentalGuide()
                            }
                            .padding(.horizontal, 30)
                            .padding(.vertical, 12)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(12)
                        }
                        .padding()
                    }
                    
                    Spacer()
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            if guideText.isEmpty && !isLoading {
                loadParentalGuide()
            }
        }
    }
    
    private func loadParentalGuide() {
        isLoading = true
        errorMessage = nil
        
        let prompt = """
        Como experto en seguridad digital infantil, proporciona una guía detallada sobre las principales amenazas que enfrentan los niños de 5 a 15 años en internet. Incluye:

        1. Principales riesgos por edad:
           - Niños de 5-8 años
           - Niños de 9-12 años
           - Adolescentes de 13-15 años

        2. Amenazas específicas:
           - Contenido inapropiado
           - Ciberbullying
           - Predadores en línea
           - Adicción a pantallas
           - Pérdida de privacidad

        3. Recomendaciones prácticas para padres:
           - Herramientas de control parental
           - Conversaciones importantes
           - Señales de alerta

        4. Recursos y medidas preventivas

        Presenta la información de manera clara, organizada y práctica para padres de familia. Usa un tono profesional pero accesible.
        """
        
        Task {
            do {
                let response = try await geminiService.generateContent(prompt: prompt)
                await MainActor.run {
                    self.guideText = response
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "No se pudo cargar la guía. Verifica tu conexión a internet."
                    self.isLoading = false
                }
            }
        }
    }
}
