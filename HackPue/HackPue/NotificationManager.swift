//
//  NotificationManager.swift
//  HackPue
//
//  Created by Liz Bello on 20/11/25.
//

import Foundation
import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()
    
    private init() {}
    
    // Solicitar permisos
    func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                print("✅ Notificaciones autorizadas")
            } else if let error = error {
                print("❌ Error al solicitar permisos: \(error.localizedDescription)")
            }
        }
    }
    
    // Cancelar notificaciones de un miembro específico
    func cancelNotifications(for memberID: String) {
        let identifiers = [
            "\(memberID)_sleep_start",
            "\(memberID)_sleep_end",
            "\(memberID)_study_start",
            "\(memberID)_study_end",
            "\(memberID)_tdah_morning",
            "\(memberID)_tdah_afternoon",
            "\(memberID)_tdah_evening"
        ]
        
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: identifiers)
        print("🗑️ Notificaciones canceladas para miembro: \(memberID)")
    }
    
    // Programar notificaciones de sueño
    func scheduleSleepNotifications(for memberID: String, name: String, sleepStart: Date, sleepEnd: Date) {
        let calendar = Calendar.current
        
        // Notificación antes de dormir
        let sleepComponents = calendar.dateComponents([.hour, .minute], from: sleepStart)
        let sleepContent = UNMutableNotificationContent()
        sleepContent.title = "Hora de dormir - \(name)"
        sleepContent.body = "Es hora de que \(name) se prepare para dormir"
        sleepContent.sound = .default
        
        let sleepTrigger = UNCalendarNotificationTrigger(dateMatching: sleepComponents, repeats: true)
        let sleepRequest = UNNotificationRequest(
            identifier: "\(memberID)_sleep_start",
            content: sleepContent,
            trigger: sleepTrigger
        )
        
        // Notificación para despertar
        let wakeComponents = calendar.dateComponents([.hour, .minute], from: sleepEnd)
        let wakeContent = UNMutableNotificationContent()
        wakeContent.title = "Hora de despertar - \(name)"
        wakeContent.body = "\(name) debe despertar ahora"
        wakeContent.sound = .default
        
        let wakeTrigger = UNCalendarNotificationTrigger(dateMatching: wakeComponents, repeats: true)
        let wakeRequest = UNNotificationRequest(
            identifier: "\(memberID)_sleep_end",
            content: wakeContent,
            trigger: wakeTrigger
        )
        
        UNUserNotificationCenter.current().add(sleepRequest)
        UNUserNotificationCenter.current().add(wakeRequest)
        
        print("🌙 Notificaciones de sueño programadas para \(name)")
    }
    
    // Programar notificaciones de estudio
    func scheduleStudyNotifications(for memberID: String, name: String, studyStart: Date, studyEnd: Date) {
        let calendar = Calendar.current
        
        let startComponents = calendar.dateComponents([.hour, .minute], from: studyStart)
        let startContent = UNMutableNotificationContent()
        startContent.title = "Hora de estudiar - \(name)"
        startContent.body = "Es hora de que \(name) comience a estudiar"
        startContent.sound = .default
        
        let startTrigger = UNCalendarNotificationTrigger(dateMatching: startComponents, repeats: true)
        let startRequest = UNNotificationRequest(
            identifier: "\(memberID)_study_start",
            content: startContent,
            trigger: startTrigger
        )
        
        let endComponents = calendar.dateComponents([.hour, .minute], from: studyEnd)
        let endContent = UNMutableNotificationContent()
        endContent.title = "Fin de estudio - \(name)"
        endContent.body = "\(name) ha terminado su horario de estudio"
        endContent.sound = .default
        
        let endTrigger = UNCalendarNotificationTrigger(dateMatching: endComponents, repeats: true)
        let endRequest = UNNotificationRequest(
            identifier: "\(memberID)_study_end",
            content: endContent,
            trigger: endTrigger
        )
        
        UNUserNotificationCenter.current().add(startRequest)
        UNUserNotificationCenter.current().add(endRequest)
        
        print("📚 Notificaciones de estudio programadas para \(name)")
    }
    
    // NUEVO: Notificaciones específicas para TDAH
    func scheduleTDAHNotifications(for memberID: String, name: String, schedules: [FocusSchedule]) {
        // Recordatorio matutino
        var morningComponents = DateComponents()
        morningComponents.hour = 8
        morningComponents.minute = 0
        
        let morningContent = UNMutableNotificationContent()
        morningContent.title = "Modo Enfoque - \(name)"
        morningContent.body = "Buenos días! Recuerda activar el Modo Enfoque para \(name)"
        morningContent.sound = .default
        
        let morningTrigger = UNCalendarNotificationTrigger(dateMatching: morningComponents, repeats: true)
        let morningRequest = UNNotificationRequest(
            identifier: "\(memberID)_tdah_morning",
            content: morningContent,
            trigger: morningTrigger
        )
        
        // Recordatorio de tarde (transiciones)
        var afternoonComponents = DateComponents()
        afternoonComponents.hour = 15
        afternoonComponents.minute = 0
        
        let afternoonContent = UNMutableNotificationContent()
        afternoonContent.title = "Cambio de actividad - \(name)"
        afternoonContent.body = "Momento de transición: revisa el Modo Enfoque de \(name)"
        afternoonContent.sound = .default
        
        let afternoonTrigger = UNCalendarNotificationTrigger(dateMatching: afternoonComponents, repeats: true)
        let afternoonRequest = UNNotificationRequest(
            identifier: "\(memberID)_tdah_afternoon",
            content: afternoonContent,
            trigger: afternoonTrigger
        )
        
        UNUserNotificationCenter.current().add(morningRequest)
        UNUserNotificationCenter.current().add(afternoonRequest)
        
        print("🎯 Notificaciones de TDAH programadas para \(name)")
    }
}
