from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from weather_routes import router as weather_router
from auth import router as auth_router

app = FastAPI(title="Weather Dashboard API")

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://weather-dashboard-teal-phi.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER INCLUSION ---
app.include_router(auth_router)
app.include_router(weather_router)

# --- BASE ROUTES ---
@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Weather Dashboard Backend is running",
        "docs": "/docs"
    }

# --- STARTUP EVENTS ---
@app.on_event("startup")
def on_startup():
    create_tables()
