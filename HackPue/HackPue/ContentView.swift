//
//  ContentView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct ContentView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var wrongUsername = 0
    @State private var wrongPassword = 0
    @State private var showingHome = false
    @State private var goToRegister = false
    @StateObject private var dataManager = DataManager()
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 1.0, green: 0.945, blue: 0.875)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // TEXTOS
                    VStack(spacing: 10) {
                        Text("Bienvenido a SafeSteps")
                            .font(.custom("Helvetica", size: 24))
                            .fontWeight(.heavy)
                            .foregroundColor(Color(red: 0.204, green: 0.420, blue: 0.671))
                        
                    }
                    .padding(.top, 30)
                    .padding(.horizontal, 20)
                    
                    // IMAGEN
                    Image("welcome1")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 300)
                        .padding(.top, 20)
                    
                    Spacer()
                    
                    // LOGIN - Card blanca redondeada
                    VStack(spacing: 18) {
                        Text("Inicia Sesión")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.black)
                        
                        TextField("Usuario", text: $username)
                            .padding()
                            .frame(height: 50)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(12)
                            .border(.red, width: CGFloat(wrongUsername))
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                        
                        SecureField("Contraseña", text: $password)
                            .padding()
                            .frame(height: 50)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(12)
                            .border(.red, width: CGFloat(wrongPassword))
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                            .textContentType(.password)
                        
                        Button(action: { authenticateUser() }) {
                            Text("Entrar")
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 50)
                                .background(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color(red: 0.204, green: 0.420, blue: 0.671),
                                            Color(red: 0.1, green: 0.4, blue: 0.8)
                                        ]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(12)
                                .fontWeight(.semibold)
                        }
                        
                        HStack(spacing: 5) {
                            Text("¿No tienes cuenta?")
                                .foregroundColor(.black)
                                .font(.caption)
                            Button("Regístrate aquí") { goToRegister = true }
                                .foregroundColor(Color(red: 0.204, green: 0.420, blue: 0.671))
                                .font(.caption)
                                .fontWeight(.semibold)
                        }
                    }
                    .padding(24)
                    .background(Color.white)
                    .cornerRadius(28)
                    .padding(.horizontal, 16)
                    .padding(.top, 30)
                    .padding(.bottom, 20)
                }
            }
            
            .navigationDestination(isPresented: $showingHome) {
                HomeView(username: username, dataManager: dataManager)
            }
            
            .navigationDestination(isPresented: $goToRegister) {
                RegisterView()
            }
            .toolbar(.hidden, for: .navigationBar)
        }
        .onAppear {
            if let savedUsername = UserDefaults.standard.string(forKey: "username") {
                username = savedUsername
            }
        }
    }
    
    func authenticateUser() {
        let savedUsername = UserDefaults.standard.string(forKey: "username")
        let savedPassword = UserDefaults.standard.string(forKey: "password")
        
        guard username == savedUsername else { wrongUsername = 2; return }
        wrongUsername = 0
        
        guard password == savedPassword else { wrongPassword = 2; return }
        wrongPassword = 0
        
        showingHome = true
    }
}

#Preview {
    ContentView()
}
