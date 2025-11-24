//
//  RegisterView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct RegisterView: View {
    @Environment(\.dismiss) var dismiss
    @State private var newUsername = ""
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var errorMessage = ""
    
    var body: some View {
        ZStack {
            Color(red: 1.0, green: 0.933, blue: 0.861)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header con botón atrás
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "chevron.left")
                            .font(.headline)
                            .foregroundColor(.black)
                    }
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                .padding(.bottom, 30)
                
                Image("welcome1")
                    .resizable()
                    .scaledToFit()
                    .frame(height: 300)
                    .padding(.top, 20)
                
                Spacer()
                
                // Card blanca
                VStack(spacing: 20) {
                    Text("Registro")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.black)
                    
                    TextField("Nuevo usuario", text: $newUsername)
                        .padding()
                        .frame(height: 50)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                    
                    SecureField("Contraseña", text: $newPassword)
                        .padding()
                        .frame(height: 50)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                        .textContentType(.newPassword)
                        .autocapitalization(.none)
                    
                    SecureField("Confirmar contraseña", text: $confirmPassword)
                        .padding()
                        .frame(height: 50)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(12)
                        .textContentType(.newPassword)
                        .autocapitalization(.none)
                    
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                            .padding(.top, 5)
                    }
                    
                    Button(action: { registerUser() }) {
                        Text("Registrarse")
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color(red: 0.204, green: 0.420, blue: 0.671))
                            .cornerRadius(12)
                            .fontWeight(.semibold)
                    }
                    .padding(.top, 10)
                }
                .padding(24)
                .background(Color.white)
                .cornerRadius(28)
                .padding(.horizontal, 16)
                .padding(.bottom, 40)
            }
        }
        .toolbar(.hidden, for: .navigationBar)
    }
    
    func registerUser() {
        guard !newUsername.isEmpty && !newPassword.isEmpty else {
            errorMessage = "Llena todos los campos"; return
        }
        guard newPassword == confirmPassword else {
            errorMessage = "Las contraseñas no coinciden"; return
        }
        
        UserDefaults.standard.set(newUsername, forKey: "username")
        UserDefaults.standard.set(newPassword, forKey: "password")
        
        dismiss()
    }
}

#Preview {
    RegisterView()
}
