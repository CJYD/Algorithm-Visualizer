interface ControlPanelProps {
    onLoadAlgorithm: (algorithmName: string) => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onNewArray: () => void;
    isPlaying: boolean;
    currentAlgorithm: string;
}

export default function ControlPanel({
    onLoadAlgorithm,
    onPlay,
    onPause,
    onReset,
    onNewArray,
    isPlaying,
    currentAlgorithm
}: ControlPanelProps) {
    return (
        <div className="control-panel">
            <div className="algorithm-section">
                <label className="section-label">Algorithm Selection</label>
                <select 
                    onChange={(e) => onLoadAlgorithm(e.target.value)}
                    className="algorithm-select"
                    value={currentAlgorithm}
                >
                    <option value="">Choose an algorithm...</option>
                    <option value="bubble">Bubble Sort</option>
                    <option value="quick">Quick Sort (coming soon)</option>
                    <option value="merge">Merge Sort (coming soon)</option>
                </select>
            </div>

            <div className="controls-section">
                <label className="section-label">Playback Controls</label>
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
                    gap: 1.5rem;
                }
                
                .algorithm-section,
                .controls-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .section-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .algorithm-select {
                    padding: 12px 16px;
                    font-size: 1rem;
                    border-radius: var(--radius-sm);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-primary);
                    color: var(--text-primary);
                    transition: all 0.2s ease;
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
                    padding: 12px 20px;
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
                    min-width: 100px;
                    justify-content: center;
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
            `}</style>
        </div>
    );
}