import os
from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Setup Base Directory
# This finds the absolute path of the folder containing this file
BASE_DIR = Path(__file__).resolve().parent

# 2. Load environment variables
load_dotenv(dotenv_path=BASE_DIR / ".env")

# 3. Handle Database URL
# If on Render/Production, it uses DATABASE_URL. 
# If local, it creates an absolute path to weather.db to avoid "file not found" errors.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    db_path = BASE_DIR / "weather.db"
    DATABASE_URL = f"sqlite:///{db_path}"

# 4. Engine Configuration
# connect_args={"check_same_thread": False} is required for SQLite + FastAPI
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 5. User Model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# 6. Table Creation Function
def create_tables():
    Base.metadata.create_all(bind=engine)