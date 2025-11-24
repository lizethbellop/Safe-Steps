//
//  ChartView.swift
//  HackPue
//
//  Created by Liz Bello on 17/08/25.
//

import SwiftUI
import SpriteKit

struct ChartData {
    let label: String
    let value: Double
    let color: UIColor
}

class AnimatedChartScene: SKScene {
    private var chartData: [ChartData] = []
    
    convenience init(screenTime: [Double]) {
        self.init(size: CGSize(width: 400, height: 300))
        let labels = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]
        chartData = zip(labels, screenTime).map { label, value in
            ChartData(label: label, value: value, color: .systemBlue)
        }
    }
    
    override func didMove(to view: SKView) {
        backgroundColor = .systemBackground
        setupCharts()
    }
    
    private func setupCharts() {
        removeAllChildren()
        
        let chartWidth = size.width * 0.85
        let chartHeight = size.height * 0.6
        let chartOriginX = (size.width - chartWidth) * 0.5
        let chartOriginY = size.height * 0.15
        
        let barWidth = chartWidth / CGFloat(chartData.count) * 0.7
        let spacing = chartWidth / CGFloat(chartData.count) * 0.3
        let maxValue = chartData.map { $0.value }.max() ?? 10
        
        for (index, data) in chartData.enumerated() {
            createAnimatedBar(
                data: data,
                index: index,
                barWidth: barWidth,
                spacing: spacing,
                maxValue: maxValue,
                chartHeight: chartHeight,
                chartOriginX: chartOriginX,
                chartOriginY: chartOriginY
            )
        }
    }
    
    private func createAnimatedBar(
        data: ChartData,
        index: Int,
        barWidth: CGFloat,
        spacing: CGFloat,
        maxValue: Double,
        chartHeight: CGFloat,
        chartOriginX: CGFloat,
        chartOriginY: CGFloat
    ) {
        let startX = chartOriginX + (barWidth + spacing) * CGFloat(index) + spacing / 2
        let barHeight = CGFloat(data.value / maxValue) * chartHeight
        
        let barContainer = SKNode()
        barContainer.position = CGPoint(x: startX, y: chartOriginY)
        addChild(barContainer)
        
        let bar = SKShapeNode(rect: CGRect(x: 0, y: 0, width: barWidth, height: barHeight), cornerRadius: 4)
        bar.fillColor = data.color
        bar.strokeColor = data.color.withAlphaComponent(0.2)
        bar.lineWidth = 0.5
        bar.yScale = 0
        barContainer.addChild(bar)
        
        let valueLabel = SKLabelNode(text: "\(Int(data.value))h")
        valueLabel.fontName = "AvenirNext-Bold"
        valueLabel.fontSize = barWidth * 0.3
        valueLabel.fontColor = .label
        valueLabel.position = CGPoint(x: barWidth / 2, y: barHeight + 12)
        valueLabel.alpha = 0
        barContainer.addChild(valueLabel)
        
        let xLabel = SKLabelNode(text: data.label)
        xLabel.fontName = "AvenirNext-Medium"
        xLabel.fontSize = barWidth * 0.25
        xLabel.fontColor = .secondaryLabel
        xLabel.position = CGPoint(x: barWidth / 2, y: -25)
        barContainer.addChild(xLabel)
        
        // Animaciones
        let delay = Double(index) * 0.2
        let scaleAction = SKAction.scaleY(to: 1, duration: 0.8)
        scaleAction.timingMode = .easeOut
        bar.run(SKAction.sequence([SKAction.wait(forDuration: delay), scaleAction]))
        
        let fadeIn = SKAction.fadeIn(withDuration: 0.4)
        let moveUp = SKAction.moveBy(x: 0, y: 10, duration: 0.4)
        valueLabel.run(SKAction.sequence([SKAction.wait(forDuration: delay + 0.5), SKAction.group([fadeIn, moveUp])]))
    }
    
    override func didChangeSize(_ oldSize: CGSize) {
        super.didChangeSize(oldSize)
        setupCharts()
    }
}

struct ChartView: View {
    let screenTime: [Double]
    
    var scene: SKScene {
        let scene = AnimatedChartScene(screenTime: screenTime)
        scene.scaleMode = .resizeFill
        return scene
    }
    
    var body: some View {
        SpriteView(scene: scene)
            .frame(height: 250)
    }
}
