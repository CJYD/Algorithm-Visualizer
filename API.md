# API Documentation

## Overview

The Algorithm Visualizer API provides endpoints for executing sorting algorithms and returning step-by-step visualization data. Built with FastAPI and Python.

**Base URL**: `http://localhost:8000`

## Authentication

No authentication required for local development.

## Endpoints

### POST `/api/algorithm/{algorithm_name}`

Execute a sorting algorithm and return visualization actions.

#### Parameters

**Path Parameters:**
- `algorithm_name` (string, required): The name of the algorithm to execute
  - Supported values: `bubble`, `selection`, `insertion`, `quick`, `merge`

**Request Body:**
```json
{
  "array_size": 50,
  "sort_direction": "asc"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `array_size` | integer | No | 50 | Size of the array to sort (5-100) |
| `sort_direction` | string | No | "asc" | Sort direction ("asc" or "desc") |

#### Response

**Success Response (200 OK):**
```json
{
  "algorithm": "bubble",
  "input_array": [34, 7, 23, 32, 5, 21, 10],
  "actions": [
    {
      "type": "compare",
      "positions": [0, 1],
      "values": [34, 7]
    },
    {
      "type": "swap",
      "positions": [0, 1], 
      "values": [7, 34]
    }
  ],
  "total_steps": 156,
  "array_size": 7
}
```

| Field | Type | Description |
|-------|------|-------------|
| `algorithm` | string | Name of the executed algorithm |
| `input_array` | array[integer] | Original randomly generated array |
| `actions` | array[Action] | Step-by-step visualization actions |
| `total_steps` | integer | Total number of actions |
| `array_size` | integer | Actual array size used |

**Error Response (400 Bad Request):**
```json
{
  "error": "Algorithm 'invalid_name' is not supported."
}
```

## Data Models

### Action Object

Each action represents a single step in the sorting process:

```json
{
  "type": "compare|swap|set",
  "positions": [0, 1],
  "values": [34, 7]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Action type (see below) |
| `positions` | array[integer] | Array indices involved in the action |
| `values` | array[integer] | Values at the specified positions |

### Action Types

#### `compare`
- **Description**: Highlights elements being compared
- **Used by**: All algorithms
- **Positions**: 2 elements being compared
- **Visual**: Red highlighting

#### `swap`
- **Description**: Exchanges two elements
- **Used by**: Bubble, Selection, Insertion, Quick Sort
- **Positions**: 2 elements to swap
- **Visual**: Orange highlighting + position exchange

#### `set`
- **Description**: Places element in specific position
- **Used by**: Merge Sort
- **Positions**: 1 element being placed
- **Visual**: Purple highlighting

## Algorithm Implementations

### Bubble Sort (`bubble`)
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Stable**: Yes
- **Actions**: Compare adjacent elements, swap if needed

### Selection Sort (`selection`)
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Stable**: No
- **Actions**: Find min/max element, swap to correct position

### Insertion Sort (`insertion`)
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Stable**: Yes
- **Actions**: Compare with sorted portion, swap into position

### Quick Sort (`quick`)
- **Time Complexity**: O(n log n) average, O(n²) worst
- **Space Complexity**: O(log n)
- **Stable**: No
- **Actions**: Partition around pivot, recursive sorting

### Merge Sort (`merge`)
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Stable**: Yes
- **Actions**: Divide and merge with set operations

## Request/Response Examples

### Example: Bubble Sort (Ascending)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/algorithm/bubble" \
  -H "Content-Type: application/json" \
  -d '{
    "array_size": 5,
    "sort_direction": "asc"
  }'
```

**Response:**
```json
{
  "algorithm": "bubble",
  "input_array": [64, 34, 25, 12, 22],
  "actions": [
    {
      "type": "compare",
      "positions": [0, 1],
      "values": [64, 34]
    },
    {
      "type": "swap",
      "positions": [0, 1],
      "values": [34, 64]
    },
    {
      "type": "compare", 
      "positions": [1, 2],
      "values": [64, 25]
    },
    {
      "type": "swap",
      "positions": [1, 2], 
      "values": [25, 64]
    }
  ],
  "total_steps": 16,
  "array_size": 5
}
```

### Example: Quick Sort (Descending)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/algorithm/quick" \
  -H "Content-Type: application/json" \
  -d '{
    "array_size": 6,
    "sort_direction": "desc"
  }'
```

**Response:**
```json
{
  "algorithm": "quick",
  "input_array": [15, 8, 42, 3, 27, 19],
  "actions": [
    {
      "type": "compare",
      "positions": [0, 5],
      "values": [15, 19]
    },
    {
      "type": "swap",
      "positions": [1, 0],
      "values": [8, 15]
    }
  ],
  "total_steps": 23,
  "array_size": 6
}
```

## Validation Rules

### Array Size
- **Minimum**: 5
- **Maximum**: 100
- **Default**: 50
- **Behavior**: Values outside range are clamped to boundaries

### Sort Direction
- **Valid values**: "asc", "desc"
- **Case sensitivity**: Converted to lowercase
- **Default**: "asc"
- **Behavior**: Invalid values default to "asc"

### Algorithm Names
- **Valid values**: "bubble", "selection", "insertion", "quick", "merge"
- **Case sensitivity**: Exact match required
- **Behavior**: Invalid names return error response

## Error Handling

### Common Error Responses

#### Unsupported Algorithm (400)
```json
{
  "error": "Algorithm 'invalid_name' is not supported."
}
```

#### Invalid Request Body (422)
```json
{
  "detail": [
    {
      "loc": ["body", "array_size"],
      "msg": "ensure this value is greater than or equal to 5",
      "type": "value_error.number.not_ge",
      "ctx": {"limit_value": 5}
    }
  ]
}
```

## Rate Limiting

No rate limiting implemented for local development. Consider implementing for production deployment.

## CORS

CORS is configured to allow all origins for development:
- **Allowed Origins**: `*`
- **Allowed Methods**: `*`
- **Allowed Headers**: `*`
- **Allow Credentials**: `true`

## Health Check

The API provides automatic health checks via FastAPI's built-in `/docs` endpoint:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Development

### Running the API
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Testing Endpoints
The API includes interactive documentation at `/docs` for easy testing of endpoints.

### Debugging
Enable debug mode by setting `debug=True` in FastAPI app configuration.