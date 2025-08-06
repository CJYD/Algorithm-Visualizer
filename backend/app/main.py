# Library imports
import random
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Create data validation class
class AlgorithmRequest(BaseModel):
    pass

@app.post("/api/algorithm/{algorithm_name}")
async def run_algorithm(algorithm_name: str, request: AlgorithmRequest):
    # Generate a random array of integers
    random_array = [random.randint(1,100) for _ in range(50)]
    return {
        "algorithm_name": algorithm_name,
        "input_array": random_array,
        "size": 50,
        "result": f"Generated random array for {algorithm_name} algorithm",
    }