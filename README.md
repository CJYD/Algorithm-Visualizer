# Algorithm Visualizer

**Interactive Sorting Algorithm Visualization Platform**

An educational tool that brings sorting algorithms to life through stunning real-time visualizations. Watch algorithms work step-by-step, compare their behaviors, and gain deeper insights into how different sorting techniques operate.

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/CJYD/algorithm-visualizer)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Backend-Python-blue)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Algorithm Visualizer is an interactive web application designed to help students, educators, and developers understand sorting algorithms through dynamic visual representations. Built with modern web technologies, it combines the power of Next.js for the frontend and Python for the backend to deliver smooth, real-time animations of sorting processes.

## Key Features

- **Real-time Visual Rendering** - High-performance HTML5 Canvas visualization with smooth animations
- **Interactive Playback Controls** - Play, pause, reset, and step through algorithms at your own pace
- **Multiple Sorting Algorithms** - Compare 5 different sorting algorithms side-by-side
- **Dynamic Configuration** - Adjust array size (5-100 elements), animation speed (10-1000ms), and sort direction
- **Color-Coded Actions** - Visual feedback for comparisons, swaps, and merges
- **Responsive Design** - Optimized for desktop and mobile devices

## Supported Algorithms

### Currently Implemented
- **Bubble Sort** - O(n²) time complexity, compare and swap adjacent elements
- **Selection Sort** - O(n²) time complexity, select minimum and place in position
- **Insertion Sort** - O(n²) average case, build sorted array incrementally
- **Quick Sort** - O(n log n) average case, divide-and-conquer with pivot
- **Merge Sort** - O(n log n) guaranteed, recursive divide and merge

## Technical Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe development
- **HTML5 Canvas** - Hardware-accelerated graphics
- **Tailwind CSS** - Modern styling

### Backend
- **Python 3.7+** - Algorithm implementations
- **FastAPI/Flask** - RESTful API endpoints
- **NumPy** - Efficient array operations

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.7+
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/CJYD/algorithm-visualizer.git
cd algorithm-visualizer
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. **Run the development server**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
python app.py
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## Project Structure

```
algorithm-visualizer/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── api/              # API routes
│   └── page.tsx          # Main page
├── backend/               # Python backend
│   ├── algorithms/       # Sorting implementations
│   ├── utils/           # Utility functions
│   └── app.py           # Main server
├── public/               # Static assets
├── styles/              # Global styles
└── package.json         # Dependencies
```

## How It Works

### Architecture
The application uses a hybrid architecture:

1. **User Interface** - React components handle user interactions and state management
2. **API Layer** - Next.js API routes proxy requests to the Python backend
3. **Algorithm Engine** - Python processes sorting algorithms and records actions
4. **Visualization** - Canvas renders animations based on recorded actions

### Data Flow
1. User selects algorithm and parameters
2. Frontend requests sorting data from backend
3. Python generates array and executes algorithm
4. Backend returns initial array and action sequence
5. Frontend animates through actions step-by-step

## Usage Guide

### Basic Operation
1. Select a sorting algorithm from the dropdown
2. Adjust array size and animation speed as desired
3. Click "Play" to start visualization
4. Use playback controls to pause, reset, or generate new arrays

### Visual Indicators
- **Blue** - Normal elements
- **Red** - Elements being compared
- **Orange** - Elements being swapped
- **Purple** - Elements being merged/set

## Educational Value

### Learning Objectives
- Understand algorithm mechanics through visualization
- Compare time complexity in practice
- Observe algorithm behavior patterns
- Analyze performance characteristics

### Use Cases
- Computer Science education
- Technical interview preparation
- Algorithm research and analysis
- Code documentation and debugging

## Future Enhancements

### Planned Features
- Additional algorithms (Heap Sort, Radix Sort, etc.)
- Performance metrics dashboard
- Side-by-side algorithm comparison
- Custom input arrays
- Export animations as GIF/video
- Dark/light theme toggle

### Technical Improvements
- WebAssembly for performance
- Real-time collaboration features
- Algorithm complexity analysis
- Mobile touch gestures
- Accessibility enhancements

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation instructions
- [API Documentation](./docs/API.md) - Backend API reference
- [Architecture](./docs/ARCHITECTURE.md) - Technical design details

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various algorithm visualization tools
- Built with modern web technologies
- Designed for educational purposes

---

**Built for the developer community**

[Star this repo](https://github.com/CJYD/algorithm-visualizer) • [Report Bug](https://github.com/CJYD/algorithm-visualizer/issues) • [Request Feature](https://github.com/CJYD/algorithm-visualizer/issues)