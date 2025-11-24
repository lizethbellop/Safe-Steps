//
//  DataManager.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import Foundation
import SwiftUI

class DataManager: ObservableObject {
    @Published var members: [Member] = []
    
    init() {
        loadMembers()
    }
    
    private func loadMembers() {
        if let data = UserDefaults.standard.data(forKey: "members"),
           let decodedMembers = try? JSONDecoder().decode([Member].self, from: data) {
            members = decodedMembers
        }
    }
    
    func saveMembers() {
        if let encoded = try? JSONEncoder().encode(members) {
            UserDefaults.standard.set(encoded, forKey: "members")
        }
    }
    
    func addMember(_ member: Member) {
        var newMember = member
        // Generar datos de ejemplo únicos para cada miembro
        newMember.screenTime = generateRandomScreenTime()
        members.append(newMember)
        saveMembers()
    }
    
    func removeMember(at index: Int) {
        members.remove(at: index)
        saveMembers()
    }
    
    private func generateRandomScreenTime() -> [Double] {
        // Generar datos aleatorios entre 1.0 y 8.0 horas para cada día
        return (0..<7).map { _ in
            Double.random(in: 1.0...8.0).rounded(toPlaces: 1)
        }
    }
}

// Extensión para redondear Double a un número específico de decimales
extension Double {
    func rounded(toPlaces places: Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}
