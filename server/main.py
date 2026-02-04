# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import api_router

# FastAPI app instance banaya
app = FastAPI(
    title="Media Genre Classifier API",
    description="An API to classify the genre of audio and video files.",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware
# Yeh zaroori hai taaki hamara frontend (jo alag port par chalega)
# backend se baat kar sake.
origins = [
    "http://localhost:5173",  # Vite + React ka default port
    "http://localhost:3000",  # Create React App ka default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main API router ko include kiya
app.include_router(api_router)

@app.get("/", tags=["Root"])
async def read_root():
    """ A simple health check endpoint. """
    return {"message": "Welcome to the Media Genre Classifier API!"}