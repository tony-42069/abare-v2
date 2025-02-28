"""
Dependency injection utilities for the ABARE Platform v2 backend
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import Generator, Optional, Dict, Any
from pydantic import ValidationError
import logging

# Import local modules
from app.config import settings
from app.db.mongodb import get_database, get_in_memory_db
from app.models.user import User
from app.schemas.user import UserInDB, TokenData

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=settings.LOG_LEVEL)

# OAuth2 token URL - used by FastAPI's OpenAPI docs
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/token")


async def get_db() -> Generator:
    """
    Dependency for getting the database connection.
    Falls back to in-memory database if MongoDB is unavailable.
    """
    try:
        if settings.USE_IN_MEMORY_DB:
            db = get_in_memory_db()
            logger.info("Using in-memory database")
        else:
            db = await get_database()
            logger.info("Connected to MongoDB")
        yield db
    except Exception as e:
        logger.warning(f"Database connection failed: {str(e)}")
        logger.warning("Falling back to in-memory database")
        db = get_in_memory_db()
        yield db


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(get_db)
) -> UserInDB:
    """
    Dependency for getting the current authenticated user.
    Verifies the JWT token and retrieves the user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except (JWTError, ValidationError):
        raise credentials_exception
    
    # Get user from database
    user_collection = db[User.collection]
    user = await user_collection.find_one({"email": token_data.email})
    
    if user is None:
        raise credentials_exception
    
    return UserInDB(**user)


async def get_current_active_user(
    current_user: UserInDB = Depends(get_current_user),
) -> UserInDB:
    """
    Dependency for getting the current active user.
    Checks if the user is active.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_admin_user(
    current_user: UserInDB = Depends(get_current_active_user),
) -> UserInDB:
    """
    Dependency for getting the current admin user.
    Checks if the user is an admin.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user 