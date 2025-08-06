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
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>Algorithm Controls</h2>
            <div>
                {/* Dropdown to select algorithm */}
                <select onChange={(e) => onLoadAlgorithm(e.target.value)}>
                    <option value="">Select Algorithm</option>
                    <option value="bubble">Bubble Sort</option>
                    <option value="quick">Quick Sort (coming soon)</option>
                    <option value="merge">Merge Sort (coming soon)</option>
                </select>
            </div>

            {/* Playback controls */}
            <div style={{ marginTop: '10px' }}>
                <button onClick={onPlay} disabled={isPlaying} style={{ marginRight: '5px' }}>
                    Play
                </button>
                <button onClick={onPause} disabled={!isPlaying} style={{ marginRight: '5px' }}>
                    Pause
                </button>
                <button onClick={onReset} style={{ marginRight: '5px' }}>
                    Reset
                </button>
                <button 
                    onClick={onNewArray} 
                    disabled={!currentAlgorithm || isPlaying}
                    style={{ marginRight: '5px', backgroundColor: '#27ae60', color: 'white' }}
                >
                    New Array
                </button>
            </div>
        </div>

    );
}