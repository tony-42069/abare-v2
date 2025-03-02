"""
Document schemas for request and response validation
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class DocumentBase(BaseModel):
    """Base document schema with common attributes"""
    title: str
    description: Optional[str] = None
    property_id: Optional[str] = None


class DocumentCreate(DocumentBase):
    """Schema for creating a new document"""
    pass


class DocumentUpdate(BaseModel):
    """Schema for updating an existing document"""
    title: Optional[str] = None
    description: Optional[str] = None
    property_id: Optional[str] = None


class DocumentInDB(DocumentBase):
    """Schema for document from database"""
    id: str = Field(..., alias="_id")
    file_path: str
    file_size: int
    file_type: str
    uploaded_by: str
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }


class Document(DocumentBase):
    """Schema for document response"""
    id: str
    file_path: str
    file_size: int
    file_type: str
    uploaded_by: str
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True
    }


class DocumentUploadResult(BaseModel):
    """Schema for document upload result"""
    id: str
    title: str
    file_type: str
    file_size: int
    upload_success: bool
    message: Optional[str] = None 