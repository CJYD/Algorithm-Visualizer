import { useState, useRef, useEffect } from 'react';
import ControlPanel from "../src/components/ControlPanel";
import Canvas from "../src/components/Canvas";

export default function Home() {
    // State to track our app data
    const [algorithm, setAlgorithm] = useState('')
    const [inputArray, setInputArray] = useState<number[]>([])
    const [workingArray, setWorkingArray] = useState<number[]>([])
    const [actions, setActions] = useState<any[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    
    // Use ref to store interval so we can clear it
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const handleLoadAlgorithm = async (algorithmName: string) => {
        console.log('Loading algorithm:', algorithmName)
        
        // Reset animation state when loading new algorithm
        setCurrentStep(0)
        setIsPlaying(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        
        try {
            const baseURL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'domain.com';

            const response = await fetch(`${baseURL}/api/algorithm/${algorithmName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            
            const data = await response.json()
            console.log('Got data from backend:', data)

            setAlgorithm(algorithmName)
            setInputArray(data.input_array)
            setWorkingArray([...data.input_array]) // Copy of the array for visualization
            setActions(data.actions)

        } catch (error) {
            console.error('Error calling backend:', error)
        }
    }

    const handlePlay = () => {
        console.log('Play clicked')
        console.log('Actions length:', actions.length)
        console.log('Current step:', currentStep)
        
        if (actions.length === 0) {
            console.log('No actions loaded! Select an algorithm first.')
            return
        }
        
        if (currentStep >= actions.length - 1) {
            console.log('Animation finished. Use Reset to start over.')
            return
        }
        
        setIsPlaying(true)
        
        intervalRef.current = setInterval(() => {
            setCurrentStep(prev => {
                const nextStep = prev + 1
                console.log('Step:', nextStep, 'of', actions.length)
                
                if (nextStep >= actions.length) {
                    setIsPlaying(false)
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current)
                        intervalRef.current = null
                    }
                    return prev
                }
                
                // Apply the current action to the working array
                const currentAction = actions[nextStep]
                if (currentAction && currentAction.type === 'swap') {
                    setWorkingArray(prevArray => {
                        const newArray = [...prevArray]
                        const pos1 = currentAction.positions[0]
                        const pos2 = currentAction.positions[1]
                        // Swap the elements
                        const temp = newArray[pos1]
                        newArray[pos1] = newArray[pos2]
                        newArray[pos2] = temp
                        return newArray
                    })
                }
                
                return nextStep
            })
        }, 100)
    }

    const handlePause = () => {
        console.log('Paused clicked')
        setIsPlaying(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handleReset = () => {
        console.log('Reset clicked')
        setCurrentStep(0)
        setIsPlaying(false)
        setWorkingArray([...inputArray]) // Reset to original array
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handleNewArray = () => {
        console.log('New Array clicked')
        if (algorithm) {
            // Reload the same algorithm with a new random array
            handleLoadAlgorithm(algorithm)
        }
    }

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to the Algorithm Visualizer</h1>
            <ControlPanel
                onLoadAlgorithm={handleLoadAlgorithm}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                onNewArray={handleNewArray}
                isPlaying={isPlaying}
                currentAlgorithm={algorithm}
            />

            <div style={{ marginTop: '20px' }}>
                <Canvas 
                    array={workingArray} 
                    actions={actions} 
                    currentStep={currentStep} 
                />
            </div>
            
            {/* Debug info */}
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                Algorithm: {algorithm} | Step: {currentStep} of {actions.length} | Playing: {isPlaying ? 'Yes' : 'No'}
            </div>
        </div>
    );
}
