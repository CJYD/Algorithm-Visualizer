import { useEffect, useRef } from "react";

interface CanvasProps {
    array: number[]
    actions: any[]
    currentStep: number
    originalMaxValue: number
}

export default function Canvas({ array, actions, currentStep, originalMaxValue }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const drawArray = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set high DPI for crisp rendering
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'

        // Clear with dark background
        ctx.fillStyle = '#0d1117'
        ctx.fillRect(0, 0, rect.width, rect.height)

        if (array.length === 0) return

        // Calculate bar dimensions with better spacing
        const padding = 40
        const barSpacing = 2
        const availableWidth = rect.width - (padding * 2)
        const barWidth = (availableWidth - (array.length - 1) * barSpacing) / array.length
        const maxHeight = rect.height - padding * 2
        const maxValue = originalMaxValue  // Use fixed max value to prevent graph resizing

        // Get current action for highlighting
        const currentAction = actions[currentStep]
        let comparePositions: number[] = []
        let swapPositions: number[] = []
        let setPositions: number[] = []

        if (currentAction) {
            if (currentAction.type === 'compare') {
                comparePositions = currentAction.positions || []
            } else if (currentAction.type === 'swap') {
                swapPositions = currentAction.positions || []
            } else if (currentAction.type === 'set') {
                setPositions = currentAction.positions || []
            }
        }

        // Draw each bar with modern styling
        array.forEach((value, index) => {
            const barHeight = (value / maxValue) * maxHeight
            const x = padding + index * (barWidth + barSpacing)
            const y = rect.height - padding - barHeight

            // Determine colors based on current action
            let gradient: CanvasGradient
            
            if (comparePositions.includes(index)) {
                // Red gradient for comparison
                gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
                gradient.addColorStop(0, '#f85149')
                gradient.addColorStop(1, '#da3633')
            } else if (swapPositions.includes(index)) {
                // Orange gradient for swap
                gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
                gradient.addColorStop(0, '#fb8500')
                gradient.addColorStop(1, '#d29922')
            } else if (setPositions.includes(index)) {
                // Purple gradient for set/merge placement
                gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
                gradient.addColorStop(0, '#a855f7')
                gradient.addColorStop(1, '#7c3aed')
            } else {
                // Default blue gradient
                gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
                gradient.addColorStop(0, '#58a6ff')
                gradient.addColorStop(1, '#1f6feb')
            }

            // Draw bar with rounded corners effect
            ctx.fillStyle = gradient
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 8
            ctx.shadowOffsetY = 2
            
            ctx.beginPath()
            ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
            ctx.fill()
            
            // Reset shadow
            ctx.shadowColor = 'transparent'
            ctx.shadowBlur = 0
            ctx.shadowOffsetY = 0

            // Draw border
            ctx.strokeStyle = '#30363d'
            ctx.lineWidth = 1
            ctx.stroke()

        })

        // Draw grid lines for better visual reference
        ctx.strokeStyle = '#21262d'
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        
        // Horizontal grid lines
        for (let i = 1; i <= 4; i++) {
            const y = rect.height - padding - (maxHeight / 4) * i
            ctx.beginPath()
            ctx.moveTo(padding, y)
            ctx.lineTo(rect.width - padding, y)
            ctx.stroke()
        }
        
        ctx.setLineDash([])
    }

    useEffect(() => {
        drawArray()
    }, [array, actions, currentStep])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setTimeout(drawArray, 100) // Small delay to ensure proper sizing
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [array, actions, currentStep])

    return (
        <div className="canvas-wrapper">
            <canvas 
                ref={canvasRef}
                className="visualization-canvas"
            />
            <style jsx>{`
                .canvas-wrapper {
                    width: 100%;
                    height: 400px;
                    position: relative;
                    border-radius: var(--radius);
                    overflow: hidden;
                    background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
                    border: 1px solid var(--border-primary);
                }
                
                .visualization-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                    cursor: default;
                }
                
                @media (max-width: 768px) {
                    .canvas-wrapper {
                        height: 300px;
                    }
                }
            `}</style>
        </div>
     )
}
