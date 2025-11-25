//
//  ContentService.swift
//  HackPue
//
//  Created by Liz Bello on 20/11/25.
//

import Foundation
import SwiftUI

// MARK: - Modelos de datos
struct Activity: Identifiable, Codable {
    let id = UUID()
    let title: String
    let description: String
    let duration: String
    let ageRange: String
    let category: String
    let icon: String
    let color: String
    
    enum CodingKeys: String, CodingKey {
        case title, description, duration, ageRange, category, icon, color
    }
}

struct Article: Identifiable, Codable {
    let id = UUID()
    let title: String
    let summary: String
    let category: String
    let readTime: String
    let date: String
    let source: String
    let icon: String
    let color: String
    
    enum CodingKeys: String, CodingKey {
        case title, summary, category, readTime, date, source, icon, color
    }
}

struct ActivitiesResponse: Codable {
    let activities: [Activity]
}

struct ArticlesResponse: Codable {
    let articles: [Article]
}

// MARK: - Servicio de Contenido
class ContentService: ObservableObject {
    @Published var isLoading = false
    @Published var error: String?
    
    // ✅ CAMBIO AQUÍ: Crear una nueva instancia cada vez
    private func getGeminiService() -> GeminiService {
        return GeminiService()
    }
    
    // MARK: - Fetch Activities
    func fetchActivities(category: String = "Todas", count: Int = 10) async -> [Activity] {
        await MainActor.run {
            isLoading = true
            error = nil
        }
        
        let prompt = GeminiPrompts.buildActivitiesPrompt(category: category, count: count)
        
        do {
            let geminiService = getGeminiService()
            let responseText = try await geminiService.generateContent(prompt: prompt)
            
            // Limpiar respuesta (remover markdown si existe)
            let cleanedText = cleanJSONResponse(responseText)
            
            // Debug: mostrar respuesta limpia
            print("📥 Respuesta limpia Activities: \(cleanedText.prefix(200))...")
            
            // Decodificar JSON
            guard let jsonData = cleanedText.data(using: .utf8) else {
                await MainActor.run {
                    self.error = "Error al convertir respuesta a JSON"
                    self.isLoading = false
                }
                return []
            }
            
            let decoder = JSONDecoder()
            let activitiesResponse = try decoder.decode(ActivitiesResponse.self, from: jsonData)
            
            await MainActor.run {
                self.isLoading = false
            }
            
            return activitiesResponse.activities
            
        } catch let geminiError as GeminiError {
            await MainActor.run {
                self.error = geminiError.errorDescription
                self.isLoading = false
            }
            return []
        } catch let decodingError as DecodingError {
            print("❌ Error decodificación Activities: \(decodingError)")
            await MainActor.run {
                self.error = "Error al procesar la respuesta de IA"
                self.isLoading = false
            }
            return []
        } catch {
            await MainActor.run {
                self.error = "Error inesperado: \(error.localizedDescription)"
                self.isLoading = false
            }
            return []
        }
    }
    
    // MARK: - Fetch Articles
    func fetchArticles(category: String = "Todas", count: Int = 12) async -> [Article] {
        await MainActor.run {
            isLoading = true
            error = nil
        }
        
        let prompt = GeminiPrompts.buildArticlesPrompt(category: category, count: count)
        
        do {
            let geminiService = getGeminiService()
            let responseText = try await geminiService.generateContent(prompt: prompt)
            
            // Limpiar respuesta (remover markdown si existe)
            let cleanedText = cleanJSONResponse(responseText)
            
            // Debug: mostrar respuesta limpia
            print("📥 Respuesta limpia Articles: \(cleanedText.prefix(200))...")
            
            // Decodificar JSON
            guard let jsonData = cleanedText.data(using: .utf8) else {
                await MainActor.run {
                    self.error = "Error al convertir respuesta a JSON"
                    self.isLoading = false
                }
                return []
            }
            
            let decoder = JSONDecoder()
            let articlesResponse = try decoder.decode(ArticlesResponse.self, from: jsonData)
            
            await MainActor.run {
                self.isLoading = false
            }
            
            return articlesResponse.articles
            
        } catch let geminiError as GeminiError {
            await MainActor.run {
                self.error = geminiError.errorDescription
                self.isLoading = false
            }
            return []
        } catch let decodingError as DecodingError {
            print("❌ Error decodificación Articles: \(decodingError)")
            await MainActor.run {
                self.error = "Error al procesar la respuesta de IA"
                self.isLoading = false
            }
            return []
        } catch {
            await MainActor.run {
                self.error = "Error inesperado: \(error.localizedDescription)"
                self.isLoading = false
            }
            return []
        }
    }
    
    // MARK: - Helper para limpiar respuesta JSON
    private func cleanJSONResponse(_ text: String) -> String {
        var cleaned = text.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Remover markdown si existe
        cleaned = cleaned.replacingOccurrences(of: "```json", with: "")
        cleaned = cleaned.replacingOccurrences(of: "```", with: "")
        cleaned = cleaned.trimmingCharacters(in: .whitespacesAndNewlines)
        
        return cleaned
    }
}
