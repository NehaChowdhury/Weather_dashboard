from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from weather_routes import router as weather_router
from auth import router as auth_router

app = FastAPI(title="Weather Dashboard API")

# --- CORS CONFIGURATION ---
# This allows your Vite/React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER INCLUSION ---
# 1. Auth: Handles /auth/register and /auth/login
app.include_router(auth_router)

# 2. Weather: Handles /weather and /weather/forecast
app.include_router(weather_router)

# --- BASE ROUTES ---
@app.get("/")
def home():
    """Quick health check to see if the backend is alive."""
    return {
        "status": "online",
        "message": "Weather Dashboard Backend is running",
        "docs": "/docs"
    }

# --- STARTUP EVENTS ---
@app.on_event("startup")
def on_startup():
    """
    Creates the database tables automatically when the server starts 
    if they don't already exist.
    """
    create_tables()