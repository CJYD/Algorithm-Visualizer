## Algorithm Visualizer Web App (Next.js + Python Backend)

A single-page web application using Next.js (TypeScript) for the UI and FastAPI (Python) for algorithm computation. Users choose an algorithm from a dropdown, visualize its steps on one canvas, and adjust speed/array size—all in one page. Tailwind CSS styling and Vercel deployment come later.

---

### Project Directory Layout

```plaintext
algorithm-visualizer/         # Root folder
├── backend/                  # Python backend (FastAPI)
│   ├── app/                  # Backend application code
│   │   ├── main.py           # Entrypoint: dynamic POST /api/algorithm/{name}
│   │   └── algorithms/       # Algorithm modules
│   │       ├── bubble.py     # Bubble Sort: generate_actions
│   │       ├── quick.py      # Quick Sort
│   │       ├── merge.py      # Merge Sort
│   │       └── __init__.py   # Collects modules into a dict
│   └── requirements.txt      # fastapi, uvicorn, pydantic
├── public/                   # Static assets
│   └── favicon.ico
├── pages/                    # Next.js routing
│   ├── api/                  # Frontend proxy to backend
│   │   └── algorithm.ts      # POST /api/algorithm → FastAPI
│   ├── _app.tsx              # App wrapper (CSS & providers)
│   └── index.tsx             # Single visualization page
├── src/                      # Frontend source shared code
│   ├── components/           # Reusable UI elements
│   │   ├── ControlPanel.tsx  # Algorithm dropdown + controls
│   │   ├── Slider.tsx        # Speed & array size
│   │   └── Canvas.tsx        # &lt;canvas&gt; wrapper
│   ├── visualizer/           # Visualization logic
│   │   ├── controller.ts     # loadAlgorithm, play, pause, reset
│   │   └── renderer.ts       # Canvas drawing & animation
│   └── styles/               # Tailwind & global CSS
│       └── globals.css       # Import in _app.tsx
├── tsconfig.json             # TypeScript settings
├── next.config.js            # Rewrites to Python backend if needed
├── package.json              # Frontend deps & scripts
└── README.md                 # Overview, setup, workflow
```

---

### Key File Responsibilities

#### `pages/api/algorithm.ts`

- **Purpose**: Forward frontend POST to Python backend.
- **Needs**: Read `{ name, array }`, call FastAPI at `/api/algorithm/{name}`, return JSON actions.

#### `pages/index.tsx`

- **Purpose**: Renders the single-page UI.
- **Needs**:
  - Import `ControlPanel`, `Canvas`.
  - React state: `algorithmName`, `array`, `actions`, `isPlaying`, `speed`.
  - Handler `loadAlgorithm(name, size)` to POST to `/api/algorithm`.
  - Effects to step through `actions` when `isPlaying`.
  - Pass current action/array state to `Canvas`.

#### `src/components/ControlPanel.tsx`

- **Purpose**: Dropdown + buttons.
- **Needs**:
  - Dropdown to select from supported algorithms (bubble, quick, merge).
  - Input or slider for array size.
  - Buttons: `Load`, `Play`, `Pause`, `Reset`.
  - Callbacks: `onLoad(name, size)`, `onPlay()`, etc.

#### `src/components/Slider.tsx`

- **Purpose**: Adjust `speed`.
- **Needs**:
  - Controlled range input with min/max.
  - Display current speed value.

#### `src/components/Canvas.tsx`

- **Purpose**: Render canvas and expose ref.
- **Needs**:
  - Set up `<canvas>` element.
  - Accept props: `actions`, `currentStep`, and render accordingly.

#### `src/visualizer/controller.ts`

- **Purpose**: Manage action sequence.
- **Needs**:
  - `loadAlgorithm(name, size)` → fetch actions.
  - `play()`, `pause()`, `reset()` to control an index pointer.
  - `onStep(callback)` to notify next action based on `speed`.

#### `src/visualizer/renderer.ts`

- **Purpose**: Draw and animate.
- **Needs**:
  - Initialize canvas context and sizing.
  - Functions to handle each action type (`compare`, `swap`, `overwrite`).
  - Redraw array state each frame.

#### `README.md`

- **Purpose**: Guides setup and run.
- **Needs**:
  1. **Backend**: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
  2. **Frontend**: `npm install && npm run dev`
  3. **Workflow**: How to load algorithm, control playback.

---

### Development Roadmap

1. **Backend FastAPI**: Ensure `/api/algorithm/{name}` returns actions for a given `size`.
2. **Next.js Baseline**: `npx create-next-app@latest --ts`, install dependencies.
3. **API Proxy**: Implement `pages/api/algorithm.ts` to forward requests.
4. **UI Components**: Build `ControlPanel` and `Slider` with props and callbacks.
5. **Controller Logic**: In `index.tsx`, wire `loadAlgorithm`, state for `actions`, and playback.
6. **Canvas Renderer**: Draw initial array and animate via `renderer.ts` on each step.
7. **Integration Test**: Load array of size 20 with Bubble Sort, verify animations.
8. **Tailwind Setup**: Add Tailwind config, style components.
9. **Deployment**: Frontend to Vercel (with rewrites), backend to a Python host.

---

With this one-page design, you’ll switch algorithms via dropdown, keep UI focused, and manage all visualization from a single component. Which step should we start coding together?

