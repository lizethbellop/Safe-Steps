//
//  FocusModeScheduleView.swift
//  HackPue
//
//  Created by Liz Bello on 20/11/25.
//

import SwiftUI

struct FocusModeScheduleView: View {
    @Binding var schedules: [FocusSchedule]
    @Environment(\.dismiss) var dismiss
    @State private var showingAddSchedule = false
    
    var body: some View {
        List {
            Section {
                Button(action: { showingAddSchedule = true }) {
                    Label("Agregar horario", systemImage: "plus.circle.fill")
                }
            }
            
            Section(header: Text("Horarios configurados")) {
                if schedules.isEmpty {
                    Text("No hay horarios configurados")
                        .foregroundColor(.secondary)
                } else {
                    ForEach(schedules) { schedule in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(dayName(schedule.dayOfWeek))
                                .font(.headline)
                            Text("\(formatTime(schedule.startTime)) - \(formatTime(schedule.endTime))")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .onDelete(perform: deleteSchedule)
                }
            }
        }
        .navigationTitle("Modo Enfoque")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingAddSchedule) {
            AddFocusScheduleView { newSchedule in
                schedules.append(newSchedule)
            }
        }
    }
    
    private func deleteSchedule(at offsets: IndexSet) {
        schedules.remove(atOffsets: offsets)
    }
    
    private func dayName(_ day: Int) -> String {
        let days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        guard day >= 1 && day <= 7 else { return "Desconocido" }
        return days[day - 1]
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

struct AddFocusScheduleView: View {
    @Environment(\.dismiss) var dismiss
    var onSave: (FocusSchedule) -> Void
    
    @State private var startTime = Date()
    @State private var endTime = Date()
    @State private var selectedDay = 2 // Lunes por defecto
    
    let days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    
    var body: some View {
        NavigationView {
            Form {
                Picker("Día", selection: $selectedDay) {
                    ForEach(1...7, id: \.self) { day in
                        Text(days[day - 1]).tag(day)
                    }
                }
                
                DatePicker("Hora de inicio", selection: $startTime, displayedComponents: .hourAndMinute)
                DatePicker("Hora de fin", selection: $endTime, displayedComponents: .hourAndMinute)
            }
            .navigationTitle("Nuevo Horario")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancelar") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Guardar") {
                        let schedule = FocusSchedule(
                            startTime: startTime,
                            endTime: endTime,
                            dayOfWeek: selectedDay
                        )
                        onSave(schedule)
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    FocusModeScheduleView(schedules: .constant([]))
}
