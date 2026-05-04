from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from weather_routes import router as weather_router
from auth import router as auth_router

app = FastAPI(title="Weather Dashboard API")

# --- CORS CONFIGURATION ---
origins = [
    # Production URL (Always include both with and without trailing slash for safety)
    "https://weather-dashboard-teal-phi.vercel.app",
    "https://weather-dashboard-teal-phi.vercel.app/",
    
    # Local Development
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Adding this helps with complex requests in production
    expose_headers=["*"], 
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

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- STARTUP EVENTS ---
@app.on_event("startup")
def on_startup():
    # Ensure tables are created in the Render PostgreSQL database
    create_tables()