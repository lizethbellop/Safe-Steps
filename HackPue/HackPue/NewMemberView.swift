//
//  NewMemberView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI
import CoreImage
import CoreImage.CIFilterBuiltins

struct NewMemberView: View {
    @Environment(\.dismiss) var dismiss
    var onSave: (Member) -> Void
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var birthdate = Date()
    @State private var shouldBeSleeping = false
    @State private var shouldBeStudying = false
    @State private var sleepStart = Date()
    @State private var sleepEnd = Date()
    @State private var studyStart = Date()
    @State private var studyEnd = Date()
    @State private var showQR = false
    @State private var generatedMember: Member?
    
    @State private var hasTDAH = false
    @State private var focusModeEnabled = false
    @State private var focusModeSchedule: [FocusSchedule] = []
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Información personal")) {
                    TextField("Nombre", text: $firstName)
                    TextField("Apellido", text: $lastName)
                    DatePicker("Fecha de nacimiento", selection: $birthdate, displayedComponents: .date)
                }
                
                Section(header: Text("Información médica")) {
                    Toggle("¿Tiene TDAH?", isOn: $hasTDAH)
                    
                    if hasTDAH {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Image(systemName: "lightbulb.fill")
                                    .foregroundColor(.orange)
                                Text("Recomendación")
                                    .fontWeight(.semibold)
                            }
                            
                            Text("Para niños con TDAH, recomendamos activar el Modo Enfoque que incluye:")
                                .font(.caption)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Label("Alertas de cambio frecuente de apps", systemImage: "arrow.triangle.swap")
                                Label("Recordatorios de tareas programadas", systemImage: "clock.fill")
                                Label("Límites de tiempo personalizados", systemImage: "hourglass")
                                Label("Bloqueo de distracciones", systemImage: "hand.raised.fill")
                            }
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            
                            Toggle("Activar Modo Enfoque", isOn: $focusModeEnabled)
                                .tint(.orange)
                        }
                        .padding(.vertical, 8)
                    }
                }
                
                Section(header: Text("Configuraciones especiales")) {
                    Toggle("Modo sueño", isOn: $shouldBeSleeping)
                    if shouldBeSleeping {
                        DatePicker("Hora de dormir", selection: $sleepStart, displayedComponents: .hourAndMinute)
                        DatePicker("Hora de despertar", selection: $sleepEnd, displayedComponents: .hourAndMinute)
                    }
                    
                    Toggle("Modo estudio", isOn: $shouldBeStudying)
                    if shouldBeStudying {
                        DatePicker("Hora de inicio", selection: $studyStart, displayedComponents: .hourAndMinute)
                        DatePicker("Hora de término", selection: $studyEnd, displayedComponents: .hourAndMinute)
                    }
                }
                
                if focusModeEnabled {
                    Section(header: Text("Horarios de Modo Enfoque")) {
                        NavigationLink("Configurar horarios") {
                            FocusModeScheduleView(schedules: $focusModeSchedule)
                        }
                        
                        Text("El Modo Enfoque ayuda a reducir distracciones durante momentos clave del día")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Nuevo Miembro")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Guardar", action: saveUser)
                        .disabled(firstName.isEmpty || lastName.isEmpty)
                }
            }
        }
        .sheet(isPresented: $showQR) {
            if let member = generatedMember {
                QRCodeView(member: member) {
                    dismiss()
                }
            }
        }
    }
    
    func saveUser() {
        // ✅ Pasar TODOS los parámetros incluyendo hasTDAH
        let member = Member(
            firstName: firstName,
            lastName: lastName,
            birthdate: birthdate,
            shouldBeSleeping: shouldBeSleeping,
            sleepStart: shouldBeSleeping ? sleepStart : nil,
            sleepEnd: shouldBeSleeping ? sleepEnd : nil,
            shouldBeStudying: shouldBeStudying,
            studyStart: shouldBeStudying ? studyStart : nil,
            studyEnd: shouldBeStudying ? studyEnd : nil,
            hasTDAH: hasTDAH,
            focusModeEnabled: focusModeEnabled,
            focusModeSchedule: focusModeSchedule
        )
        
        onSave(member)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            generatedMember = member
            showQR = true
        }
    }
}

// QRCodeView
struct QRCodeView: View {
    let member: Member
    @Environment(\.dismiss) var dismiss
    @State private var qrCodeImage: UIImage?
    var onComplete: (() -> Void)?
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                VStack(spacing: 15) {
                    Text("¡Miembro agregado exitosamente!")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .multilineTextAlignment(.center)
                    
                    Text("Escanea este código QR para vincular el dispositivo de \(member.fullName)")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                VStack(spacing: 20) {
                    if let qrImage = qrCodeImage {
                        Image(uiImage: qrImage)
                            .interpolation(.none)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 250, height: 250)
                            .background(Color.white)
                            .cornerRadius(12)
                            .shadow(radius: 5)
                    } else {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.gray.opacity(0.3))
                            .frame(width: 250, height: 250)
                            .overlay(ProgressView())
                    }
                    
                    VStack(spacing: 8) {
                        Text("ID del Miembro")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(member.id.uuidString.prefix(8).uppercased())
                            .font(.system(.body, design: .monospaced))
                            .fontWeight(.medium)
                    }
                }
                
                VStack(spacing: 12) {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .foregroundColor(.blue)
                        Text(member.fullName)
                            .fontWeight(.medium)
                        Spacer()
                    }
                    
                    HStack {
                        Image(systemName: "calendar.circle.fill")
                            .foregroundColor(.green)
                        Text("Edad: \(member.age) años")
                        Spacer()
                    }
                    
                    HStack {
                        Image(systemName: "shield.circle.fill")
                            .foregroundColor(.orange)
                        Text("Nivel de protección: \(member.riskLevel)")
                        Spacer()
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Código QR")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cerrar") {
                        dismiss()
                        onComplete?()
                    }
                }
            }
        }
        .onAppear {
            generateQRCode()
        }
    }
    
    private func generateQRCode() {
        let memberData = QRMemberData(
            id: member.id.uuidString,
            name: member.fullName,
            age: member.age,
            riskLevel: member.riskLevel
        )
        
        if let jsonData = try? JSONEncoder().encode(memberData),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            qrCodeImage = createQRCode(from: jsonString)
        }
    }
    
    private func createQRCode(from string: String) -> UIImage {
        let context = CIContext()
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(string.utf8)
        
        if let outputImage = filter.outputImage {
            let transform = CGAffineTransform(scaleX: 10, y: 10)
            let scaledImage = outputImage.transformed(by: transform)
            
            if let cgimg = context.createCGImage(scaledImage, from: scaledImage.extent) {
                return UIImage(cgImage: cgimg)
            }
        }
        
        return UIImage(systemName: "xmark.circle") ?? UIImage()
    }
}

struct QRMemberData: Codable {
    let id: String
    let name: String
    let age: Int
    let riskLevel: String
}

#Preview {
    NewMemberView { _ in }
}
