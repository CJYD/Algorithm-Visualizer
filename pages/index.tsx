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
    const [speed, setSpeed] = useState(100) // milliseconds between steps
    const [arraySize, setArraySize] = useState(50) // number of elements
    const [sortDirection, setSortDirection] = useState('asc') // 'asc' or 'desc'
    
    // Use ref to store interval so we can clear it
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const handleLoadAlgorithm = async (algorithmName: string, customArraySize?: number) => {
        const sizeToUse = customArraySize ?? arraySize
        console.log('Loading algorithm:', algorithmName)
        
        // Reset animation state when loading new algorithm
        setCurrentStep(0)
        setIsPlaying(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        
        try {
            // Call our Next.js API route which will proxy to the Python backend
            const response = await fetch(`/api/algorithm/${algorithmName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    array_size: sizeToUse,
                    sort_direction: sortDirection 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('Got data from backend:', data)
            
            // Check if backend returned an error
            if (data.error) {
                console.error('Backend error:', data.error)
                return
            }

            // Validate the response data
            if (!data.input_array || !Array.isArray(data.input_array)) {
                console.error('Invalid input_array received:', data.input_array)
                return
            }
            
            if (!data.actions || !Array.isArray(data.actions)) {
                console.error('Invalid actions received:', data.actions)
                return
            }

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
        
        if (currentStep >= actions.length) {
            console.log('Animation finished. Restarting from beginning.')
            // Reset to beginning and start playing
            setCurrentStep(0)
            setWorkingArray([...inputArray]) // Reset to original array
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
                    return actions.length // Set to exact length when finished
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
                } else if (currentAction && currentAction.type === 'set') {
                    setWorkingArray(prevArray => {
                        const newArray = [...prevArray]
                        const position = currentAction.positions[0]
                        const newValue = currentAction.values[0]
                        // Set the element directly
                        newArray[position] = newValue
                        return newArray
                    })
                }
                
                return nextStep
            })
        }, speed)
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
        
        // Safely reset the working array
        if (inputArray && Array.isArray(inputArray)) {
            setWorkingArray([...inputArray]) // Reset to original array
        }
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handleNewArray = () => {
        console.log('New Array clicked')
        if (algorithm) {
            // Reload the same algorithm with a new random array
            handleLoadAlgorithm(algorithm, arraySize)
        }
    }

    // Helper function to get algorithm display name
    const getAlgorithmDisplayName = (algoName: string) => {
        const nameMap: { [key: string]: string } = {
            'bubble': 'Bubble Sort',
            'selection': 'Selection Sort',
            'insertion': 'Insertion Sort',
            'quick': 'Quick Sort',
            'merge': 'Merge Sort'
        }
        return nameMap[algoName] || algoName
    }

    // Helper function to get current status
    const getCurrentStatus = () => {
        if (isPlaying) return 'Playing'
        if (currentStep >= actions.length && actions.length > 0) return 'Ready to Replay'
        if (currentStep > 0) return 'Paused'
        return 'Ready'
    }

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed)
        // If currently playing, restart with new speed
        if (isPlaying && intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            // Restart playing with new speed
            setTimeout(() => handlePlay(), 50)
        }
    }

    const handleArraySizeChange = (newSize: number) => {
        setArraySize(newSize)
        // If an algorithm is loaded, reload it with new size
        if (algorithm) {
            handleLoadAlgorithm(algorithm, newSize)
        }
    }

    // Auto-reload algorithm when sort direction changes
    useEffect(() => {
        if (algorithm) {
            // Only reload if we have an algorithm loaded
            handleLoadAlgorithm(algorithm, arraySize)
        }
    }, [sortDirection])

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Algorithm Visualizer</h1>
                <p className="subtitle">Interactive sorting algorithm visualization</p>
            </div>
            
            <div className="visualizer-card">
                <ControlPanel
                    onLoadAlgorithm={handleLoadAlgorithm}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onReset={handleReset}
                    onNewArray={handleNewArray}
                    isPlaying={isPlaying}
                    currentAlgorithm={algorithm}
                    speed={speed}
                    onSpeedChange={handleSpeedChange}
                    arraySize={arraySize}
                    onArraySizeChange={handleArraySizeChange}
                    sortDirection={sortDirection}
                    onSortDirectionChange={setSortDirection}
                />

                <div className="canvas-container">
                    <Canvas 
                        array={workingArray} 
                        actions={actions} 
                        currentStep={currentStep}
                        originalMaxValue={inputArray.length > 0 ? Math.max(...inputArray) : 100}
                    />
                </div>
                
                {/* Status info */}
                <div className="status-info">
                    <span className="status-item">
                        <span className="label">Algorithm:</span> 
                        <span className="value">{algorithm ? getAlgorithmDisplayName(algorithm) : 'None'}</span>
                    </span>
                    <span className="status-item">
                        <span className="label">Step:</span> 
                        <span className="value">{Math.min(currentStep, actions.length)}</span> / 
                        <span className="value">{actions.length}</span>
                    </span>
                    <span className="status-item">
                        <span className="label">Status:</span> 
                        <span className={`value ${getCurrentStatus().toLowerCase().replace(/\s+/g, '')}`}>
                            {getCurrentStatus()}
                        </span>
                    </span>
                </div>
            </div>
            
            <style jsx>{`
                .container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    gap: 2rem;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 1rem;
                }
                
                .title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }
                
                .subtitle {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    font-weight: 400;
                }
                
                .visualizer-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius);
                    padding: 2rem;
                    box-shadow: var(--shadow);
                    max-width: 900px;
                    width: 100%;
                    backdrop-filter: blur(10px);
                }
                
                .canvas-container {
                    margin: 2rem 0;
                    display: flex;
                    justify-content: center;
                    border-radius: var(--radius);
                    overflow: hidden;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-primary);
                }
                
                .status-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-primary);
                    font-size: 0.875rem;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .label {
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                
                .value {
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .value.playing {
                    color: var(--accent-success);
                }
                
                .value.paused {
                    color: var(--text-secondary);
                }
                
                .value.finished {
                    color: var(--accent-primary);
                }
                
                .value.ready {
                    color: var(--text-muted);
                }
                
                .value.readytoreplay {
                    color: var(--accent-success);
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 1rem;
                    }
                    
                    .title {
                        font-size: 2rem;
                    }
                    
                    .visualizer-card {
                        padding: 1.5rem;
                    }
                    
                    .status-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
