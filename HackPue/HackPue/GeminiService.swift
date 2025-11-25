//
//  GeminiService.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import Foundation

// MARK: - Gemini Service
class GeminiService: ObservableObject {
    // Pon tu API key aquí directamente
    private let apiKey = "AIzaSyB6M9GFqmdgR20vaiWFBvUJ1n8-Rd1MML8"
    
    // Modelos disponibles (cambia si necesitas):
    // - gemini-2.0-flash-exp (más reciente)
    // - gemini-1.5-pro-latest (más estable)
    // - gemini-1.5-flash-8b (más rápido)
    private let model = "gemini-2.0-flash-exp"
    
    private var baseURL: String {
        "https://generativelanguage.googleapis.com/v1beta/models/\(model):generateContent"
    }
    
    // Control de rate limiting
    private var lastRequestTime: Date?
    private let minRequestInterval: TimeInterval = 2.0 // 2 segundos entre requests
    
    func generateContent(prompt: String) async throws -> String {
        // Rate limiting: esperar si la última petición fue muy reciente
        if let lastTime = lastRequestTime {
            let timeSinceLastRequest = Date().timeIntervalSince(lastTime)
            if timeSinceLastRequest < minRequestInterval {
                let waitTime = minRequestInterval - timeSinceLastRequest
                print("⏳ Esperando \(String(format: "%.1f", waitTime))s para evitar rate limit...")
                try await Task.sleep(nanoseconds: UInt64(waitTime * 1_000_000_000))
            }
        }
        lastRequestTime = Date()
        
        // Validar API Key
        guard !apiKey.isEmpty, apiKey.hasPrefix("AIza") else {
            throw GeminiError.invalidAPIKey
        }
        
        // Crear URL
        guard let url = URL(string: "\(baseURL)?key=\(apiKey)") else {
            throw GeminiError.invalidURL
        }
        
        // Crear request body
        let requestBody: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": prompt]
                    ]
                ]
            ]
        ]
        
        // Crear request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 60.0
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        } catch {
            print("❌ Error creando request: \(error)")
            throw GeminiError.encodingError
        }
        
        // Hacer request
        do {
            print("🌐 Enviando a Gemini...")
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw GeminiError.invalidResponse
            }
            
            print("📊 Status: \(httpResponse.statusCode)")
            
            // Manejar errores HTTP
            switch httpResponse.statusCode {
            case 200:
                break
            case 400:
                if let errorStr = String(data: data, encoding: .utf8) {
                    print("❌ Error 400: \(errorStr)")
                }
                throw GeminiError.badRequest
            case 401:
                throw GeminiError.unauthorized
            case 403:
                throw GeminiError.forbidden
            case 429:
                throw GeminiError.rateLimitExceeded
            case 500...599:
                throw GeminiError.serverError(httpResponse.statusCode)
            default:
                throw GeminiError.httpError(httpResponse.statusCode)
            }
            
            // Parse response
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let candidates = json["candidates"] as? [[String: Any]],
                  let firstCandidate = candidates.first,
                  let content = firstCandidate["content"] as? [String: Any],
                  let parts = content["parts"] as? [[String: Any]],
                  let firstPart = parts.first,
                  let text = firstPart["text"] as? String else {
                
                if let jsonStr = String(data: data, encoding: .utf8) {
                    print("📥 Response: \(jsonStr)")
                }
                throw GeminiError.noContent
            }
            
            print("✅ Respuesta recibida!")
            return text
            
        } catch let error as GeminiError {
            throw error
        } catch let urlError as URLError {
            print("❌ URL Error: \(urlError.localizedDescription)")
            switch urlError.code {
            case .notConnectedToInternet:
                throw GeminiError.networkError("Sin conexión a internet")
            case .timedOut:
                throw GeminiError.networkError("La solicitud tardó demasiado")
            case .cannotFindHost, .cannotConnectToHost:
                throw GeminiError.networkError("No se puede conectar al servidor")
            default:
                throw GeminiError.networkError(urlError.localizedDescription)
            }
        } catch {
            print("❌ Error general: \(error)")
            throw GeminiError.networkError(error.localizedDescription)
        }
    }
}

// MARK: - Errors
enum GeminiError: Error, LocalizedError {
    case invalidAPIKey
    case invalidURL
    case encodingError
    case noContent
    case badRequest
    case unauthorized
    case forbidden
    case rateLimitExceeded
    case serverError(Int)
    case httpError(Int)
    case networkError(String)
    case invalidResponse
    
    var errorDescription: String? {
        switch self {
        case .invalidAPIKey:
            return "API Key inválida"
        case .invalidURL:
            return "URL inválida"
        case .encodingError:
            return "Error creando la solicitud"
        case .noContent:
            return "No se recibió respuesta válida"
        case .badRequest:
            return "Solicitud incorrecta (400)"
        case .unauthorized:
            return "API Key no autorizada (401)"
        case .forbidden:
            return "Acceso prohibido (403)"
        case .rateLimitExceeded:
            return "Límite de solicitudes excedido (429)"
        case .serverError(let code):
            return "Error del servidor (\(code))"
        case .httpError(let code):
            return "Error HTTP (\(code))"
        case .networkError(let message):
            return message
        case .invalidResponse:
            return "Respuesta inválida del servidor"
        }
    }
}
