//
//  Config.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import Foundation

struct Config {
    // Tu API key de Google AI Studio
    static let geminiAPIKey = "AIzaSyC_wiO2fwTnzAiqVnUM9hCQJNxn0kj6Wbw"
    
    // Método para verificar si la API Key está configurada
    static var isAPIKeyConfigured: Bool {
        return !geminiAPIKey.isEmpty && geminiAPIKey.hasPrefix("AIza")
    }
}
