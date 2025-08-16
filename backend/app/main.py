from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
import os
from pydantic import BaseModel

app = FastAPI(title="BookTok API", description="API for serving textbook excerpts")

# CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Excerpt(BaseModel):
    id: int
    text: str

# This will be loaded when the server starts
excerpts: List[Excerpt] = []

def load_excerpts():
    """Load excerpts from JSON file"""
    global excerpts
    try:
        file_path = os.path.join(os.path.dirname(__file__), "data", "excerpts.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            excerpts = [Excerpt(**item) for item in data]
    except Exception as e:
        print(f"Error loading excerpts: {e}")
        excerpts = []

# Load excerpts when the app starts
load_excerpts()

@app.get("/api/excerpts", response_model=List[Excerpt])
async def get_excerpts(page: int = 0, size: int = 5):
    """
    Get paginated excerpts from the textbook
    
    Args:
        page: Page number (0-indexed)
        size: Number of items per page
        
    Returns:
        List of excerpt objects
    """
    if not excerpts:
        raise HTTPException(status_code=503, detail="Excerpts not loaded")
        
    start_idx = page * size
    end_idx = start_idx + size
    
    if start_idx >= len(excerpts):
        return []
        
    return excerpts[start_idx:end_idx]

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "excerpts_loaded": len(excerpts) > 0}
