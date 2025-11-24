//
//  FamilyView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct FamilyView: View {
    @ObservedObject var dataManager: DataManager
    @State private var showingNewMember = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach(dataManager.members) { member in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(member.fullName)
                            .font(.headline)
                        
                        Text("Nacimiento: \(member.birthdate.formatted(date: .abbreviated, time: .omitted))")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        // Mostrar configuraciones activas
                        HStack {
                            if member.shouldBeSleeping {
                                Label("Sueño", systemImage: "moon.fill")
                                    .font(.caption)
                                    .foregroundColor(.purple)
                            }
                            if member.shouldBeStudying {
                                Label("Estudio", systemImage: "book.fill")
                                    .font(.caption)
                                    .foregroundColor(.green)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
                .onDelete(perform: deleteMember)
            }
            .navigationTitle("Miembros")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingNewMember = true
                    } label: {
                        Label("Agregar", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingNewMember) {
                NewMemberView { newMember in
                    dataManager.addMember(newMember)
                }
            }
        }
    }
    
    private func deleteMember(at offsets: IndexSet) {
        for index in offsets {
            dataManager.removeMember(at: index)
        }
    }
}

#Preview {
    FamilyView(dataManager: DataManager())
}
