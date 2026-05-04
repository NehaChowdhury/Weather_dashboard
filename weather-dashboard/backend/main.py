from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from weather_routes import router as weather_router
from auth import router as auth_router

app = FastAPI(title="Weather Dashboard API")

# Update this list with your actual Vercel production URL
origins = [
    "https://weather-dashboard-teal-phi.vercel.app",
    "https://weather-dashboard-teal-phi.vercel.app/",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"], 
)

# Routing
app.include_router(auth_router)
app.include_router(weather_router)

@app.get("/")
def home():
    return {"status": "online", "message": "Backend running"}

@app.on_event("startup")
def on_startup():
    # This ensures your tables are created in the database (e.g., Render/PostgreSQL)
    create_tables()