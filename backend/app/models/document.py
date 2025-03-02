"""
Document model for database representation
"""
from typing import Optional, ClassVar
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict


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
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "title": "Lease Agreement",
                "description": "Commercial lease for tenant XYZ",
                "file_type": "pdf",
                "file_size": 1024000,
                "property_id": "5f8a3f2b9d3e2a1b8c7d6e5f"
            }
        }
    )
