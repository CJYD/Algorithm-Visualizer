interface SliderProps {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (value: number) => void
    disabled?: boolean
    unit?: string
    description?: string
}

export default function Slider({ 
    label, 
    value, 
    min, 
    max, 
    step = 1, 
    onChange, 
    disabled = false,
    unit = "",
    description
}: SliderProps) {
    // Calculate the position of the slider ball as a percentage
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
        <div className="slider-container">
            <div className="slider-header">
                <label className="slider-label">{label}</label>
            </div>
            
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="slider-input"
            />
            
            <div className="slider-range">
                <span className="range-min">{min}{unit}</span>
                <span className="range-current">{value}{unit}</span>
                <span className="range-max">{max}{unit}</span>
            </div>
            
            {description && (
                <p className="slider-description">{description}</p>
            )}
            
            <style jsx>{`
                .slider-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .slider-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .slider-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .slider-input {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: var(--bg-tertiary);
                    border-radius: 3px;
                    outline: none;
                    border: 1px solid var(--border-primary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .slider-input:hover:not(:disabled) {
                    border-color: var(--accent-primary);
                }
                
                .slider-input:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                
                .slider-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    cursor: pointer;
                    border: 2px solid var(--bg-primary);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }
                
                .slider-input::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(88, 166, 255, 0.4);
                }
                
                .slider-input::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    cursor: pointer;
                    border: 2px solid var(--bg-primary);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }
                
                .slider-range {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .range-current {
                    font-weight: 700;
                    color: var(--accent-primary);
                }
                
                .slider-description {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin: 0;
                    line-height: 1.4;
                }
            `}</style>
        </div>
    )
}