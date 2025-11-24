//
//  FeatureView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI

struct FeatureView: View {
    let icon: String
    let title: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .foregroundColor(.white)
                .frame(width: 28, height: 28)
                .background(RoundedRectangle(cornerRadius: 8).fill(color))
            
            Text(title)
                .font(.subheadline)
                .foregroundColor(.primary)
            
            Spacer()
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 12).fill(Color(.tertiarySystemBackground)))
    }
}
