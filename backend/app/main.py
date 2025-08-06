# Library imports
import random
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from app.algorithms.bubble import generate_actions
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
    pass

@app.post("/api/algorithm/{algorithm_name}")
async def run_algorithm(algorithm_name: str, request: AlgorithmRequest):
    # Generate a random array of integers
    random_array = [random.randint(1,100) for _ in range(50)]

    # Handle bubble sort algorithm
    if algorithm_name == "bubble":
        actions = generate_actions(random_array)
        return {
            "algorithm_name": algorithm_name,
            "input_array": random_array,
            "actions": actions,
            "total_steps": len(actions)
        }
    else:
        return {
            "error": f"Algorithm '{algorithm_name}' is not supported."
        }