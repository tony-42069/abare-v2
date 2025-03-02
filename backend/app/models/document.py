"""
Document model for database representation
"""
from typing import Optional, List, Dict, Any, ClassVar
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field


class Document(BaseModel):
    """
    Document model for database representation
    """
    # Collection name in MongoDB
    collection: ClassVar[str] = "documents"
    
    # Fields
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    description: Optional[str] = None
    file_path: str
    file_size: int
    file_type: str
    property_id: Optional[str] = None
    uploaded_by: str  # User ID
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "from_attributes": True
    } 