# Library imports
import random
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from app.algorithms.bubble import generate_actions as bubble_actions
from app.algorithms.quick import generate_actions as quick_actions
from app.algorithms.merge import generate_actions as merge_actions
from app.algorithms.selection import generate_actions as selection_actions
from app.algorithms.insertion import generate_actions as insertion_actions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data validation class
class AlgorithmRequest(BaseModel):
    array_size: int = 50  # Default to 50, but allow customization
    sort_direction: str = "asc"  # "asc" or "desc", default ascending

@app.post("/api/algorithm/{algorithm_name}")
async def run_algorithm(algorithm_name: str, request: AlgorithmRequest):
    # Validate array size
    array_size = max(5, min(100, request.array_size))  # Clamp between 5 and 100
    
    # Generate a random array of integers
    random_array = [random.randint(1, 100) for _ in range(array_size)]

    # Validate sort direction
    sort_direction = request.sort_direction.lower()
    if sort_direction not in ["asc", "desc"]:
        sort_direction = "asc"  # Default to ascending if invalid
    
    # Handle different algorithms
    if algorithm_name == "bubble":
        actions = bubble_actions(random_array, sort_direction)
    elif algorithm_name == "quick":
        actions = quick_actions(random_array, sort_direction)
    elif algorithm_name == "merge":
        actions = merge_actions(random_array, sort_direction)
    elif algorithm_name == "selection":
        actions = selection_actions(random_array, sort_direction)
    elif algorithm_name == "insertion":
        actions = insertion_actions(random_array, sort_direction)
    else:
        return {
            "error": f"Algorithm '{algorithm_name}' is not supported."
        }
    
    return {
        "algorithm": algorithm_name,
        "input_array": random_array,
        "actions": actions,
        "total_steps": len(actions),
        "array_size": array_size
    }