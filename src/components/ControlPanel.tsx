import Slider from './Slider'

interface ControlPanelProps {
    onLoadAlgorithm: (algorithmName: string, arraySize?: number) => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onNewArray: () => void;
    isPlaying: boolean;
    currentAlgorithm: string;
    speed: number;
    onSpeedChange: (speed: number) => void;
    arraySize: number;
    onArraySizeChange: (size: number) => void;
    sortDirection: string;
    onSortDirectionChange: (direction: string) => void;
}

export default function ControlPanel({
    onLoadAlgorithm,
    onPlay,
    onPause,
    onReset,
    onNewArray,
    isPlaying,
    currentAlgorithm,
    speed,
    onSpeedChange,
    arraySize,
    onArraySizeChange,
    sortDirection,
    onSortDirectionChange
}: ControlPanelProps) {
    return (
        <div className="control-panel">
            <div className="top-row">
                <div className="algorithm-section">
                    <label className="section-label">Algorithm</label>
                    <select 
                        onChange={(e) => onLoadAlgorithm(e.target.value, arraySize)}
                        className="algorithm-select"
                        value={currentAlgorithm}
                    >
                        <option value="">Choose algorithm...</option>
                        <option value="bubble">Bubble Sort</option>
                        <option value="insertion">Insertion Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="selection">Selection Sort</option>
                    </select>
                </div>

                <div className="algorithm-section">
                    <label className="section-label">Direction</label>
                    <select 
                        onChange={(e) => onSortDirectionChange(e.target.value)}
                        className="algorithm-select"
                        value={sortDirection}
                        disabled={isPlaying}
                    >
                        <option value="asc">Ascending ↑</option>
                        <option value="desc">Descending ↓</option>
                    </select>
                </div>

                <div className="slider-section">
                    <Slider
                        label="Array Size"
                        value={arraySize}
                        min={5}
                        max={100}
                        onChange={onArraySizeChange}
                        disabled={isPlaying}
                    />
                </div>

                <div className="slider-section">
                    <Slider
                        label="Speed"
                        value={speed}
                        min={10}
                        max={1000}
                        step={10}
                        onChange={onSpeedChange}
                        disabled={false}
                        unit="ms"
                    />
                </div>
            </div>

            <div className="controls-section">
                <div className="button-group">
                    <button 
                        onClick={onPlay} 
                        disabled={isPlaying || !currentAlgorithm}
                        className="control-button primary"
                    >
                        ▶ Play
                    </button>
                    <button 
                        onClick={onPause} 
                        disabled={!isPlaying}
                        className="control-button"
                    >
                        ⏸ Pause
                    </button>
                    <button 
                        onClick={onReset}
                        disabled={!currentAlgorithm}
                        className="control-button"
                    >
                        ⏹ Reset
                    </button>
                    <button 
                        onClick={onNewArray} 
                        disabled={!currentAlgorithm || isPlaying}
                        className="control-button success"
                    >
                        🎲 New Array
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                .control-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                
                .top-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    gap: 1.5rem;
                    align-items: center;
                }
                
                .algorithm-section,
                .slider-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .algorithm-section {
                    justify-content: center;
                    padding-top: 0.125rem;
                }
                
                .controls-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .section-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    height: 1.2em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0;
                    text-align: center;
                }
                
                .algorithm-select {
                    padding: 10px 16px;
                    font-size: 0.875rem;
                    border-radius: var(--radius-sm);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-primary);
                    color: var(--text-primary);
                    transition: all 0.2s ease;
                    height: 38px;
                    flex: 1;
                    margin-top: 0.125rem;
                    background-position: right 16px center;
                    background-size: 10px;
                }
                
                .algorithm-select:hover {
                    border-color: var(--accent-primary);
                }
                
                .algorithm-select:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
                }
                
                .button-group {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                
                .control-button {
                    padding: 10px 18px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-primary);
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 90px;
                    justify-content: center;
                    height: 38px;
                }
                
                .control-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    border-color: var(--accent-primary);
                }
                
                .control-button:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                .control-button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .control-button.primary {
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border-color: var(--accent-primary);
                    color: white;
                    font-weight: 700;
                }
                
                .control-button.primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, var(--accent-secondary), #1955d4);
                    box-shadow: 0 4px 20px rgba(88, 166, 255, 0.4);
                }
                
                .control-button.success {
                    background: linear-gradient(135deg, var(--accent-success), #2ea043);
                    border-color: var(--accent-success);
                    color: white;
                    font-weight: 700;
                }
                
                .control-button.success:hover:not(:disabled) {
                    background: linear-gradient(135deg, #2ea043, #238636);
                    box-shadow: 0 4px 20px rgba(63, 185, 80, 0.4);
                }
                
                @media (max-width: 768px) {
                    .top-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .button-group {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.5rem;
                    }
                    
                    .control-button {
                        min-width: auto;
                        padding: 10px 16px;
                        font-size: 0.8rem;
                    }
                }
                
                @media (max-width: 1024px) and (min-width: 769px) {
                    .top-row {
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                    
                    .algorithm-section:first-child {
                        grid-column: 1 / 2;
                    }
                    
                    .algorithm-section:nth-child(2) {
                        grid-column: 2 / 3;
                    }
                }
            `}</style>
        </div>
    );
}