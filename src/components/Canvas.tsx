import { useEffect, useRef } from "react";

interface CanvasProps {
    array: number[]
    actions: any[]
    currentStep: number
}

export default function Canvas({ array, actions, currentStep }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const drawArray = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (array.length === 0) return

        // Calculate bar dimensions
        const barWidth = canvas.width / array.length
        const maxHeight = canvas.height - 50  // Leave space for labels
        const maxValue = Math.max(...array)

        // Get current action for highlighting
        const currentAction = actions[currentStep]
        let comparePositions: number[] = []
        let swapPositions: number[] = []

        if (currentAction) {
            if (currentAction.type === 'compare') {
                comparePositions = currentAction.positions || []
            } else if (currentAction.type === 'swap') {
                swapPositions = currentAction.positions || []
            }
        }

        // Draw each bar
        array.forEach((value, index) => {
            const barHeight = (value / maxValue) * maxHeight
            const x = index * barWidth
            const y = canvas.height - barHeight

            // Determine bar color based on current action
            let color = '#3498db'  // Default blue
            if (comparePositions.includes(index)) {
                color = '#e74c3c'  // Red for comparison
            } else if (swapPositions.includes(index)) {
                color = '#f39c12'  // Orange for swap
            }

            ctx.fillStyle = color
            ctx.fillRect(x, y, barWidth - 2, barHeight)

            // Draw the value on top of each bar (only if bars aren't too narrow)
            if (barWidth > 15) {
                ctx.fillStyle = '#000'
                ctx.font = '10px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
            }
        })
    }

    useEffect(() => {
        drawArray()
    }, [array, actions, currentStep])

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: '1px solid #000', backgroundColor: '#f0f0f0' }}
        />
     )
}
