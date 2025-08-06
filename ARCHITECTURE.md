# Architecture Documentation

## System Overview

The Algorithm Visualizer is a full-stack web application built with a clear separation between frontend and backend concerns. The architecture follows modern web development patterns with TypeScript for type safety and Python for algorithmic computation.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Port 3000)                              │
│  ├── React Components (UI)                                 │
│  ├── Canvas Visualization                                  │
│  ├── State Management (React Hooks)                       │
│  └── API Client (Fetch)                                   │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Proxy Layer)                          │
│  └── /api/algorithm/[name].ts                             │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Backend (Port 8000)                              │
│  ├── Algorithm Implementations                            │
│  ├── Request/Response Models                              │
│  └── Action Generation Engine                             │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 15.4.5
- **UI Library**: React 19.1.1
- **Language**: TypeScript 5.9.2
- **Styling**: CSS-in-JS (styled-jsx)
- **Canvas**: HTML5 Canvas API
- **State Management**: React Hooks

### Component Architecture

```
pages/
├── _app.tsx                    # App wrapper & global styles
├── index.tsx                   # Main application page
└── api/
    └── algorithm/
        └── [name].ts          # API proxy to Python backend

src/
├── components/
│   ├── Canvas.tsx             # Visualization canvas component
│   ├── ControlPanel.tsx       # Main UI controls
│   └── Slider.tsx             # Reusable slider component
└── styles/
    └── globals.css            # Global CSS variables & styles
```

### Component Relationships

```
index.tsx (Main App)
├── ControlPanel
│   ├── Algorithm Dropdown
│   ├── Direction Dropdown  
│   ├── Array Size Slider
│   └── Speed Slider
├── Canvas (Visualization)
└── Control Buttons
    ├── Play/Pause
    ├── Reset
    └── New Array
```

### State Management

The application uses React's built-in state management with hooks:

```typescript
// Core application state
const [algorithm, setAlgorithm] = useState<string>('')
const [inputArray, setInputArray] = useState<number[]>([])
const [workingArray, setWorkingArray] = useState<number[]>([])
const [actions, setActions] = useState<Action[]>([])
const [isPlaying, setIsPlaying] = useState<boolean>(false)
const [currentStep, setCurrentStep] = useState<number>(0)
const [speed, setSpeed] = useState<number>(100)
const [arraySize, setArraySize] = useState<number>(50)
const [sortDirection, setSortDirection] = useState<string>('asc')
```

### Data Flow

1. **User Interaction** → Component event handlers
2. **State Updates** → React re-renders affected components
3. **API Calls** → Next.js API route → Python backend
4. **Response Processing** → State updates → UI updates
5. **Animation Loop** → setInterval → State updates → Canvas re-render

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI 0.115.0
- **Language**: Python 3.8+
- **Validation**: Pydantic 2.10.0
- **Server**: Uvicorn 0.32.0
- **CORS**: FastAPI CORS middleware

### Module Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI app & endpoints
│   └── algorithms/
│       ├── __init__.py        # Module initialization
│       ├── bubble.py          # Bubble sort implementation
│       ├── selection.py       # Selection sort implementation  
│       ├── insertion.py       # Insertion sort implementation
│       ├── quick.py           # Quick sort implementation
│       └── merge.py           # Merge sort implementation
└── requirements.txt           # Python dependencies
```

### Algorithm Architecture

Each algorithm follows a consistent interface pattern:

```python
def generate_actions(array: List[int], sort_direction: str = "asc") -> List[Dict]:
    """
    Generate step-by-step actions for visualization
    
    Args:
        array: Input array to sort
        sort_direction: "asc" for ascending, "desc" for descending
        
    Returns:
        List of action dictionaries with type, positions, and values
    """
```

### Action Types System

The backend generates three types of visualization actions:

```python
# Comparison action - highlight elements being compared
{
    "type": "compare",
    "positions": [i, j],
    "values": [array[i], array[j]]
}

# Swap action - exchange two elements  
{
    "type": "swap", 
    "positions": [i, j],
    "values": [array[i], array[j]]
}

# Set action - place element at specific position (merge sort)
{
    "type": "set",
    "positions": [i],
    "values": [new_value]
}
```

## API Design

### RESTful Endpoints

```
POST /api/algorithm/{algorithm_name}
```

The API follows REST principles with:
- **Resource-based URLs**: Algorithm name as path parameter
- **HTTP Methods**: POST for algorithm execution
- **Status Codes**: 200 for success, 400 for client errors
- **JSON**: Request/response format

### Request/Response Flow

```
Frontend Request:
{
  "array_size": 50,
  "sort_direction": "asc"  
}

↓

Backend Processing:
1. Validate input parameters
2. Generate random array
3. Execute sorting algorithm
4. Collect visualization actions
5. Return structured response

↓

Frontend Response:
{
  "algorithm": "bubble",
  "input_array": [64, 34, 25, 12, 22],
  "actions": [...],
  "total_steps": 156,
  "array_size": 50
}
```

## Visualization Engine

### Canvas Rendering System

The visualization uses HTML5 Canvas with high-DPI support:

```typescript
// High-DPI rendering setup
const dpr = window.devicePixelRatio || 1
canvas.width = rect.width * dpr
canvas.height = rect.height * dpr
ctx.scale(dpr, dpr)
```

### Animation Loop

```typescript
// Animation control with setInterval
intervalRef.current = setInterval(() => {
    setCurrentStep(prev => {
        const nextStep = prev + 1
        
        // Apply current action to working array
        if (currentAction?.type === 'swap') {
            // Perform element swap
        } else if (currentAction?.type === 'set') {
            // Set element value
        }
        
        return nextStep
    })
}, speed)
```

### Color Coding System

```typescript
const colors = {
    default: '#58a6ff',      // Blue gradient
    compare: '#f85149',      // Red gradient  
    swap: '#fb8500',         // Orange gradient
    set: '#a855f7'           // Purple gradient
}
```

## Performance Considerations

### Frontend Optimization
- **Canvas Optimization**: High-DPI rendering with proper scaling
- **Animation Performance**: RequestAnimationFrame for smooth updates
- **Memory Management**: Proper cleanup of intervals and event listeners
- **State Updates**: Minimal re-renders through efficient state management

### Backend Optimization
- **Algorithm Efficiency**: Optimal implementations for each sorting method
- **Memory Usage**: Copy arrays to avoid mutation of input data
- **Response Size**: Minimal action objects to reduce payload
- **Input Validation**: Early validation to prevent unnecessary processing

## Security Considerations

### Frontend Security
- **Input Validation**: Client-side parameter validation
- **XSS Prevention**: No innerHTML usage, controlled rendering
- **Type Safety**: Full TypeScript coverage

### Backend Security
- **Input Validation**: Pydantic models for request validation
- **Parameter Bounds**: Array size limits (5-100)
- **CORS Configuration**: Appropriate for development environment
- **No Authentication**: Suitable for local development only

## Error Handling

### Frontend Error Handling
```typescript
try {
    const response = await fetch('/api/algorithm', options)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    // Handle success
} catch (error) {
    console.error('API call failed:', error)
    // Handle error state
}
```

### Backend Error Handling
- **Validation Errors**: Automatic Pydantic validation
- **Algorithm Errors**: Graceful handling of unsupported algorithms
- **Parameter Sanitization**: Safe defaults for invalid inputs

## Deployment Architecture

### Development Environment
- **Frontend**: `npm run dev` (Next.js dev server)
- **Backend**: `uvicorn app.main:app --reload`
- **Communication**: Direct API calls via Next.js proxy

### Production Considerations
- **Frontend**: Static build with `npm run build`
- **Backend**: Production ASGI server (Gunicorn + Uvicorn)
- **Reverse Proxy**: Nginx for serving static assets and API routing
- **Environment Variables**: Configuration management
- **CORS**: Restrict origins for production security

## Testing Strategy

### Frontend Testing
- **Component Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright or Cypress
- **Type Checking**: TypeScript compiler

### Backend Testing  
- **Unit Testing**: pytest for algorithm correctness
- **API Testing**: FastAPI TestClient
- **Integration Testing**: Full request/response cycle

## Monitoring and Observability

### Development Monitoring
- **Console Logging**: Structured logging for debugging
- **Error Boundaries**: React error boundaries for UI errors
- **Performance Timing**: Browser DevTools integration

### Production Monitoring
- **Application Metrics**: Response times, error rates
- **Infrastructure Metrics**: CPU, memory usage
- **User Analytics**: Algorithm usage patterns
- **Error Tracking**: Centralized error collection

## Scalability Considerations

### Current Limitations
- **Single Instance**: No horizontal scaling
- **In-Memory Processing**: No persistent storage
- **Client State**: No server-side session management

### Scaling Opportunities
- **Microservices**: Separate algorithm services
- **Caching**: Redis for common algorithm results
- **CDN**: Static asset distribution
- **Load Balancing**: Multiple backend instances