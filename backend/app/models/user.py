"""
User model for database representation
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr


class User(BaseModel):
    """
    User model for database representation
    """
    # Collection name in MongoDB
    collection = "users"
    
    # Fields
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True 