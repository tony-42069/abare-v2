"""
Analysis schemas for request and response validation
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AnalysisBase(BaseModel):
    """Base analysis schema with common attributes"""
    title: str
    description: Optional[str] = None
    property_id: str
    document_ids: List[str] = Field(default_factory=list)
    analysis_type: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class AnalysisCreate(AnalysisBase):
    """Schema for creating a new analysis"""
    pass


class AnalysisUpdate(BaseModel):
    """Schema for updating an existing analysis"""
    title: Optional[str] = None
    description: Optional[str] = None
    property_id: Optional[str] = None
    document_ids: Optional[List[str]] = None
    analysis_type: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class AnalysisInDB(AnalysisBase):
    """Schema for analysis from database"""
    id: str = Field(..., alias="_id")
    results: Dict[str, Any] = Field(default_factory=dict)
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class Analysis(AnalysisBase):
    """Schema for analysis response"""
    id: str
    results: Dict[str, Any] = Field(default_factory=dict)
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True
    )


class AnalysisResult(BaseModel):
    """Schema for analysis result"""
    id: str
    title: str
    status: str
    analysis_type: str
    results: Dict[str, Any] = Field(default_factory=dict)
    completed_at: Optional[datetime] = None
    message: Optional[str] = None
