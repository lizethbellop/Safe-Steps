//
//  PastAlertsView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct PastAlertsView: View {
    @ObservedObject var dataManager: DataManager
    @State private var selectedMember: Member?
    @StateObject private var geminiService = GeminiService()
    
    // Estados para análisis IA
    @State private var alertAnalyses: [String: String] = [:]
    @State private var isLoadingAnalysis: [String: Bool] = [:]
    @State private var expandedAlerts: Set<String> = []
    @State private var generalSummary: String = ""
    @State private var isLoadingSummary = false
    @State private var errorMessages: [String: String] = [:]
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Alertas Anteriores")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Análisis inteligente de las alertas de tus hijos")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                
                // Member selector if there are multiple members
                if dataManager.members.count > 1 {
                    VStack(alignment: .leading) {
                        Text("Selecciona un miembro:")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        Picker("Miembro", selection: $selectedMember) {
                            ForEach(dataManager.members, id: \.self) { member in
                                Text(member.fullName).tag(member as Member?)
                            }
                        }
                        .pickerStyle(.segmented)
                        .padding(.horizontal)
                    }
                    .padding(.bottom)
                }
                
                // Alerts content
                if dataManager.members.isEmpty {
                    ContentUnavailableView(
                        "No hay miembros",
                        systemImage: "person.slash",
                        description: Text("Agrega miembros a tu familia para ver sus alertas")
                    )
                } else if let member = selectedMember ?? dataManager.members.first {
                    let memberAlerts = member.alertsWithExamples
                    
                    if memberAlerts.isEmpty {
                        ContentUnavailableView(
                            "Sin alertas",
                            systemImage: "bell.slash",
                            description: Text("No hay alertas registradas para \(member.firstName)")
                        )
                    } else {
                        ScrollView {
                            LazyVStack(spacing: 16) {
                                // Info de alertas de ejemplo
                                if member.alerts.isEmpty {
                                    VStack(alignment: .leading, spacing: 8) {
                                        HStack {
                                            Image(systemName: "info.circle.fill")
                                                .foregroundColor(.blue)
                                            Text("Alertas de ejemplo")
                                                .font(.subheadline)
                                                .fontWeight(.medium)
                                        }
                                        Text("Estas son alertas de ejemplo basadas en la edad y configuración de \(member.firstName). Las alertas reales aparecerán aquí cuando se detecte actividad sospechosa.")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                    .padding()
                                    .background(Color.blue.opacity(0.1))
                                    .cornerRadius(12)
                                    .padding(.horizontal)
                                }
                                
                                // Resumen IA si hay múltiples alertas
                                if memberAlerts.count > 1 {
                                    summaryCard(for: member, alerts: memberAlerts)
                                }
                                
                                // Alertas individuales
                                ForEach(Array(memberAlerts.enumerated()), id: \.offset) { index, alert in
                                    alertCard(alert: alert, index: index, member: member)
                                }
                            }
                            .padding()
                        }
                    }
                }
                
                Spacer()
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            if selectedMember == nil && !dataManager.members.isEmpty {
                selectedMember = dataManager.members.first
            }
        }
        .onChange(of: dataManager.members) { _, newMembers in
            if let selected = selectedMember, !newMembers.contains(selected) {
                selectedMember = newMembers.first
            }
            if selectedMember == nil && !newMembers.isEmpty {
                selectedMember = newMembers.first
            }
        }
        .onChange(of: selectedMember) { _, _ in
            // Reset states when member changes
            alertAnalyses.removeAll()
            expandedAlerts.removeAll()
            generalSummary = ""
            isLoadingSummary = false
            isLoadingAnalysis.removeAll()
            errorMessages.removeAll()
        }
    }
    
    // MARK: - Summary Card
    
    @ViewBuilder
    private func summaryCard(for member: Member, alerts: [String]) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "brain.head.profile")
                    .foregroundColor(.purple)
                Text("Resumen Inteligente")
                    .font(.headline)
                    .fontWeight(.semibold)
            }
            
            if isLoadingSummary {
                VStack(spacing: 12) {
                    ProgressView()
                        .scaleEffect(1.0)
                    Text("Analizando patrones de comportamiento...")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 20)
            } else if generalSummary.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "chart.bar.doc.horizontal")
                        .font(.system(size: 40))
                        .foregroundColor(.purple)
                    
                    Text("Obtén un análisis completo")
                        .font(.headline)
                        .fontWeight(.medium)
                    
                    Text("Analiza todos los patrones de comportamiento de \(member.firstName) con inteligencia artificial")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                    
                    Button("Generar análisis") {
                        generateGeneralSummary(for: member, alerts: alerts)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .background(Color.purple)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                .padding()
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    Text(generalSummary)
                        .font(.body)
                        .lineSpacing(4)
                    
                    Button("Generar nuevo análisis") {
                        generateGeneralSummary(for: member, alerts: alerts)
                    }
                    .font(.subheadline)
                    .foregroundColor(.purple)
                }
            }
        }
        .padding()
        .background(
            LinearGradient(
                colors: [Color.purple.opacity(0.1), Color.blue.opacity(0.1)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(12)
        .padding(.horizontal)
    }
    
    // MARK: - Alert Card
    
    @ViewBuilder
    private func alertCard(alert: String, index: Int, member: Member) -> some View {
        let alertKey = "\(member.id.uuidString)_\(index)"
        
        VStack(alignment: .leading, spacing: 16) {
            // Header de alerta
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.orange)
                    Text("Alerta #\(index + 1)")
                        .font(.headline)
                        .fontWeight(.semibold)
                }
                
                Spacer()
                
                Text(member.firstName)
                    .font(.subheadline)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.1))
                    .foregroundColor(.blue)
                    .cornerRadius(12)
            }
            
            // Descripción de la alerta
            VStack(alignment: .leading, spacing: 8) {
                Text("Descripción:")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.secondary)
                
                Text(alert)
                    .font(.body)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
            }
            
            // Análisis IA
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "brain.head.profile")
                        .foregroundColor(.green)
                    Text("Análisis Inteligente")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.secondary)
                }
                
                if isLoadingAnalysis[alertKey] == true {
                    VStack(spacing: 12) {
                        ProgressView()
                            .scaleEffect(0.9)
                        Text("Generando análisis personalizado...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                } else if let error = errorMessages[alertKey] {
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.system(size: 24))
                            .foregroundColor(.red)
                        
                        Text("Error al generar análisis")
                            .font(.caption)
                            .fontWeight(.medium)
                        
                        Text(error)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                        
                        Button("Reintentar") {
                            generateAlertAnalysis(alert: alert, member: member, alertKey: alertKey)
                        }
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                    .padding()
                } else if let analysis = alertAnalyses[alertKey], !analysis.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(analysis)
                            .font(.body)
                            .lineSpacing(4)
                            .padding()
                            .background(Color.green.opacity(0.1))
                            .cornerRadius(8)
                        
                        Button("Generar nuevo análisis") {
                            generateAlertAnalysis(alert: alert, member: member, alertKey: alertKey)
                        }
                        .font(.caption)
                        .foregroundColor(.green)
                    }
                } else {
                    VStack(spacing: 16) {
                        Image(systemName: "magnifyingglass.circle")
                            .font(.system(size: 32))
                            .foregroundColor(.green)
                        
                        Text("Obtén recomendaciones personalizadas")
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .multilineTextAlignment(.center)
                        
                        Text("Analiza esta alerta específica para \(member.firstName) considerando su edad (\(member.age) años)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                        
                        Button("Analizar alerta") {
                            generateAlertAnalysis(alert: alert, member: member, alertKey: alertKey)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                    .padding()
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
    
    // MARK: - IA Functions
    
    private func generateGeneralSummary(for member: Member, alerts: [String]) {
        isLoadingSummary = true
        generalSummary = ""
        
        let prompt = """
        Como experto en seguridad digital infantil, analiza las siguientes alertas de comportamiento digital de \(member.firstName), de \(member.age) años:
        
        Alertas detectadas:
        \(alerts.enumerated().map { "\($0.offset + 1). \($0.element)" }.joined(separator: "\n"))
        
        Proporciona un análisis ejecutivo en español que incluya:
        
        1. *Patrones principales identificados* en el comportamiento digital
        2. *Nivel de riesgo general* (bajo/medio/alto) con justificación
        3. *Prioridades de acción* inmediatas para los padres
        4. *Recomendaciones específicas* considerando la edad del menor
        5. *Impacto potencial* si no se abordan estas alertas
        
        Mantén un tono profesional pero comprensible para padres. Máximo 200 palabras. Usa formato claro con subtítulos cuando sea necesario.
        """
        
        Task {
            do {
                let response = try await geminiService.generateContent(prompt: prompt)
                await MainActor.run {
                    generalSummary = response
                    isLoadingSummary = false
                }
            } catch {
                await MainActor.run {
                    generalSummary = "No se pudo generar el análisis general. Error: \(error.localizedDescription)"
                    isLoadingSummary = false
                }
            }
        }
    }
    
    private func generateAlertAnalysis(alert: String, member: Member, alertKey: String) {
        isLoadingAnalysis[alertKey] = true
        errorMessages.removeValue(forKey: alertKey)
        
        let prompt = """
        Como especialista en seguridad digital infantil, analiza esta alerta específica para \(member.firstName) (edad: \(member.age) años):
        
        *Alerta detectada:*
        \(alert)
        
        Proporciona un análisis detallado en español que incluya:
        
        1. *Evaluación de riesgo*: Nivel de severidad (bajo/medio/alto) y por qué
        2. *¿Por qué es importante?*: Explicación clara del riesgo para un niño de \(member.age) años
        3. *Recomendaciones inmediatas*: 3-4 acciones específicas que los padres deben tomar
        4. *Estrategias de prevención*: Cómo evitar que esto vuelva a ocurrir
        5. *Señales de alerta*: Qué otros comportamientos observar
        6. *Impacto a largo plazo*: Consecuencias potenciales si no se aborda
        
        Considera la edad del menor, usa un tono profesional pero accesible para padres. Máximo 250 palabras.
        """
        
        Task {
            do {
                let response = try await geminiService.generateContent(prompt: prompt)
                await MainActor.run {
                    alertAnalyses[alertKey] = response
                    isLoadingAnalysis[alertKey] = false
                }
            } catch {
                await MainActor.run {
                    errorMessages[alertKey] = "No se pudo generar el análisis. Verifica tu conexión a internet."
                    isLoadingAnalysis[alertKey] = false
                }
            }
        }
    }
}
