from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import create_tables
from weather_routes import router as weather_router
from auth import router as auth_router

app = FastAPI(title="Weather Dashboard API")

# 1. Simplest way to fix CORS: Use allow_origins=["*"] 
# This tells the browser that any frontend is allowed to talk to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
    create_tables()