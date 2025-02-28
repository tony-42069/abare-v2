"""
Configuration settings for the ABARE Platform v2 backend
"""
import os
from pydantic import BaseSettings
from typing import Optional, List, Dict, Any


class Settings(BaseSettings):
    """
    Application settings with environment variable support and fallback values.
    """
    # API settings
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "ABARE Platform v2"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "AI-Based Analysis of Real Estate Platform"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # MongoDB settings
    MONGODB_URL: Optional[str] = None
    DATABASE_NAME: str = "abare_db"
    
    # Authentication settings
    SECRET_KEY: str = "your-secret-key-here-for-development-only"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # File upload settings
    UPLOAD_DIRECTORY: str = "backend/static/uploads"
    MAX_UPLOAD_SIZE: int = 20 * 1024 * 1024  # 20 MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "xlsx", "csv"]
    
    # In-memory fallback settings
    USE_IN_MEMORY_DB: bool = False
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True) 