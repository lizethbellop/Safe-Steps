//
//  HomeView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI
import Foundation

struct HomeView: View {
    let username: String
    @ObservedObject var dataManager: DataManager
    @State private var selectedMember: Member?
    @State private var showingAddMember = false
    @State private var selectedTab: Int = 0 // 0 = Home, 1 = Parental Guide, 2 = Past Alerts, 3 = Activities, 4 = Articles
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Pestaña Principal (Home)
            NavigationView {
                VStack(spacing: 20) {
                    Text("Bienvenido, \(username)")
                        .font(.title2).bold().padding()
                    
                    // Si no hay miembros, mostrar botón para agregar
                    if dataManager.members.isEmpty {
                        VStack(spacing: 15) {
                            Image(systemName: "person.badge.plus")
                                .font(.system(size: 60))
                                .foregroundColor(.blue)
                            
                            Text("No hay miembros en tu familia")
                                .font(.headline)
                                .foregroundColor(.secondary)
                            
                            Text("Agrega el primer miembro para comenzar")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                            
                            Button("Agregar primer miembro") {
                                showingAddMember = true
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }
                        .padding()
                    } else {
                        // SIEMPRE mostrar el miembro y su gráfica
                        if let member = selectedMember ?? dataManager.members.first {
                            VStack(spacing: 15) {
                                // Mostrar nombre del miembro actual
                                Text("Tiempo en pantalla de \(member.firstName)")
                                    .font(.title2).bold()
                                
                                // Gráfica del miembro
                                ZStack {
                                    RoundedRectangle(cornerRadius: 18)
                                        .fill(Color(.systemBackground))
                                        .shadow(color: Color.black.opacity(0.1), radius: 12, x: 0, y: 4)
                                    
                                    ChartView(screenTime: member.screenTime)
                                        .padding()
                                }
                                .frame(height: 300)
                                .padding(.horizontal)
                                
                                // Si hay más de un miembro, mostrar selector
                                if dataManager.members.count > 1 {
                                    VStack {
                                        Text("Cambiar miembro:")
                                            .font(.headline)
                                        
                                        Picker("Selecciona un miembro", selection: $selectedMember) {
                                            ForEach(dataManager.members, id: \.self) { member in
                                                Text(member.fullName).tag(member as Member?)
                                            }
                                        }
                                        .pickerStyle(.segmented)
                                    }
                                    .padding(.horizontal)
                                }
                            }
                        }
                    }
                    
                    // Sección de recursos
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Recursos educativos")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        // Primera fila de botones
                        HStack(spacing: 12) {
                            Button {
                                selectedTab = 1
                            } label: {
                                FeatureView(icon: "lightbulb.fill", title: "Guía parental", color: .yellow)
                            }
                            
                            Button {
                                selectedTab = 3
                            } label: {
                                FeatureView(icon: "figure.2.and.child.holdinghands", title: "Actividades", color: .green)
                            }
                        }
                        .padding(.horizontal)
                        
                        // Segunda fila de botones
                        HStack(spacing: 12) {
                            Button {
                                selectedTab = 4
                            } label: {
                                FeatureView(icon: "newspaper.fill", title: "Saber más", color: .blue)
                            }
                            
                            Button {
                                selectedTab = 2
                            } label: {
                                FeatureView(icon: "bell.badge", title: "Alertas", color: .red)
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    Spacer()
                }
                .navigationTitle("Home")
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        NavigationLink {
                            FamilyView(dataManager: dataManager)
                        } label: {
                            HStack {
                                Image(systemName: "person.2.fill")
                                Text("Miembros")
                            }
                        }
                    }
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Cerrar sesión") {
                            dismiss()
                        }
                    }
                }
                .sheet(isPresented: $showingAddMember) {
                    NewMemberView { newMember in
                        dataManager.addMember(newMember)
                        selectedMember = newMember
                    }
                }
                .onAppear {
                    // SIEMPRE seleccionar el primer miembro automáticamente
                    if dataManager.members.isEmpty {
                        selectedMember = nil
                    } else if selectedMember == nil {
                        selectedMember = dataManager.members.first
                    }
                }
                .onChange(of: dataManager.members) { _, newMembers in
                    // Si se elimina el miembro seleccionado, seleccionar otro
                    if let selected = selectedMember, !newMembers.contains(selected) {
                        selectedMember = newMembers.first
                    }
                    // Si no había miembros y ahora hay, seleccionar el primero automáticamente
                    if selectedMember == nil && !newMembers.isEmpty {
                        selectedMember = newMembers.first
                    }
                }
            }
            .tabItem {
                Image(systemName: "house.fill")
                Text("Home")
            }
            .tag(0)
            
            // Pestaña Guía Parental
            ParentalGuideView()
                .tabItem {
                    Image(systemName: "lightbulb.fill")
                    Text("Guía Parental")
                }
                .tag(1)
            
            // Pestaña Alertas Anteriores
            PastAlertsView(dataManager: dataManager)
                .tabItem {
                    Image(systemName: "bell.badge")
                    Text("Alertas")
                }
                .tag(2)
            
            // Pestaña Actividades
            ActivitiesView()
                .tabItem {
                    Image(systemName: "figure.2.and.child.holdinghands")
                    Text("Actividades")
                }
                .tag(3)
            
            // Pestaña Artículos
            ArticlesView()
                .tabItem {
                    Image(systemName: "newspaper.fill")
                    Text("Saber más")
                }
                .tag(4)
        }
        .navigationBarBackButtonHidden()
    }
}

#Preview {
    HomeView(username: "Test", dataManager: DataManager())
}
