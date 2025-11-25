//
//  Member.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import Foundation

struct Member: Identifiable, Hashable, Codable {
    let id = UUID()
    var firstName: String
    var lastName: String
    var birthdate: Date
    var shouldBeSleeping: Bool
    var sleepStart: Date?
    var sleepEnd: Date?
    var shouldBeStudying: Bool
    var studyStart: Date?
    var studyEnd: Date?
    var screenTime: [Double] = []
    var alerts: [String] = []
    
    // NUEVO: Campo para TDAH y modo enfoque
    var hasTDAH: Bool = false
    var focusModeEnabled: Bool = false
    var focusModeSchedule: [FocusSchedule] = []
    
    var fullName: String {
        "\(firstName) \(lastName)"
    }
    
    var age: Int {
        let calendar = Calendar.current
        let now = Date()
        let ageComponents = calendar.dateComponents([.year], from: birthdate, to: now)
        return ageComponents.year ?? 0
    }
    
    // NUEVO: Generar datos aleatorios de screenTime al crear el miembro
    init(
        firstName: String,
        lastName: String,
        birthdate: Date,
        shouldBeSleeping: Bool,
        sleepStart: Date?,
        sleepEnd: Date?,
        shouldBeStudying: Bool,
        studyStart: Date?,
        studyEnd: Date?,
        hasTDAH: Bool = false,
        focusModeEnabled: Bool = false,
        focusModeSchedule: [FocusSchedule] = []
    ) {
        self.firstName = firstName
        self.lastName = lastName
        self.birthdate = birthdate
        self.shouldBeSleeping = shouldBeSleeping
        self.sleepStart = sleepStart
        self.sleepEnd = sleepEnd
        self.shouldBeStudying = shouldBeStudying
        self.studyStart = studyStart
        self.studyEnd = studyEnd
        self.hasTDAH = hasTDAH
        self.focusModeEnabled = focusModeEnabled
        self.focusModeSchedule = focusModeSchedule
        
        // Generar screenTime aleatorio para 7 días
        self.screenTime = Self.generateRandomScreenTime(age: self.age, hasTDAH: hasTDAH)
    }
    
    // NUEVO: Función para generar tiempo de pantalla aleatorio
    static func generateRandomScreenTime(age: Int, hasTDAH: Bool) -> [Double] {
        var screenTime: [Double] = []
        
        // Definir rangos según la edad
        let (minHours, maxHours) = getScreenTimeRange(for: age)
        
        // Generar 7 días de datos (Lun-Dom)
        for day in 0..<7 {
            var hours: Double
            
            // Fin de semana (Vie=4, Sáb=5, Dom=6)
            if day >= 4 {
                // Fin de semana: más tiempo de pantalla
                hours = Double.random(in: (minHours + 2)...(maxHours + 3))
            } else {
                // Entre semana: menos tiempo
                hours = Double.random(in: minHours...maxHours)
            }
            
            // Si tiene TDAH, tiende a usar más la pantalla de manera impulsiva
            if hasTDAH {
                hours += Double.random(in: 0...2)
            }
            
            // Redondear a 0.5 (ej: 3.0, 3.5, 4.0)
            hours = round(hours * 2) / 2
            
            // Asegurar que no sea negativo y tenga un máximo razonable
            hours = max(1.0, min(hours, 12.0))
            
            screenTime.append(hours)
        }
        
        return screenTime
    }
    
    // Rangos de tiempo según edad
    private static func getScreenTimeRange(for age: Int) -> (min: Double, max: Double) {
        switch age {
        case 0...5:
            return (1.0, 3.0)  // Muy pequeños: 1-3 horas
        case 6...8:
            return (2.0, 4.0)  // 6-8 años: 2-4 horas
        case 9...12:
            return (3.0, 6.0)  // 9-12 años: 3-6 horas
        case 13...15:
            return (4.0, 7.0)  // 13-15 años: 4-7 horas
        case 16...18:
            return (5.0, 9.0)  // 16-18 años: 5-9 horas
        default:
            return (3.0, 6.0)
        }
    }
    
    // NUEVO: Método para regenerar screenTime (útil para "refrescar" datos)
    mutating func regenerateScreenTime() {
        self.screenTime = Self.generateRandomScreenTime(age: self.age, hasTDAH: self.hasTDAH)
    }
    
    var alertsWithExamples: [String] {
        if alerts.isEmpty {
            return generateSampleAlerts()
        }
        return alerts
    }
    
    private func generateSampleAlerts() -> [String] {
        var sampleAlerts: [String] = []
        
        // Alertas específicas para TDAH
        if hasTDAH {
            sampleAlerts.append("Cambio frecuente entre aplicaciones detectado: 23 cambios en 15 minutos")
            sampleAlerts.append("Uso de múltiples aplicaciones simultáneas afectando concentración")
            sampleAlerts.append("Tiempo de uso nocturno detectado durante horario de medicación")
            sampleAlerts.append("Patrones de uso impulsivo: compras no autorizadas en juegos")
            sampleAlerts.append("Dificultad para mantener foco: sesiones cortas en app educativa")
            
            if focusModeEnabled {
                sampleAlerts.append("Modo Enfoque desactivado durante horario programado")
                sampleAlerts.append("Intentos de acceso a aplicaciones bloqueadas durante Modo Enfoque")
            }
        }
        
        // Alertas basadas en la edad
        if age <= 8 {
            sampleAlerts.append("Tiempo excesivo en pantalla detectado: 4.5 horas en YouTube Kids")
            sampleAlerts.append("Contenido no apropiado para la edad visualizado")
            sampleAlerts.append("Intento de descarga de aplicación sin supervisión parental")
        } else if age <= 12 {
            sampleAlerts.append("Uso prolongado de redes sociales durante horario escolar")
            sampleAlerts.append("Tiempo de pantalla superó los límites recomendados: 6 horas")
            sampleAlerts.append("Interacción con contenido de riesgo moderado")
        } else {
            sampleAlerts.append("Actividad en redes sociales durante altas horas de la madrugada")
            sampleAlerts.append("Búsquedas relacionadas con contenido riesgoso detectadas")
            sampleAlerts.append("Comunicación con contactos no verificados")
        }
        
        if shouldBeSleeping {
            sampleAlerts.append("Uso de dispositivos durante horario de sueño (\(formatTime(sleepStart)) - \(formatTime(sleepEnd)))")
        }
        
        if shouldBeStudying {
            sampleAlerts.append("Distracción durante horario de estudio (\(formatTime(studyStart)) - \(formatTime(studyEnd)))")
        }
        
        return Array(sampleAlerts.prefix(5))
    }
    
    private func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "N/A" }
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    mutating func addAlert(_ alert: String) {
        alerts.append(alert)
    }
    
    mutating func clearAlerts() {
        alerts.removeAll()
    }
    
    var riskLevel: String {
        switch age {
        case 0...8:
            return "Básico"
        case 9...12:
            return "Moderado"
        case 13...15:
            return "Alto"
        default:
            return "Desconocido"
        }
    }
}

// Estructura para horarios del modo enfoque
struct FocusSchedule: Identifiable, Hashable, Codable {
    let id = UUID()
    var startTime: Date
    var endTime: Date
    var dayOfWeek: Int // 1 = Domingo, 2 = Lunes, etc.
    var allowedApps: [String] = []
    var notificationsEnabled: Bool = true
}
