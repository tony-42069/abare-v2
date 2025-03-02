"""
Analysis model for database representation
"""
from typing import Optional, List, Dict, Any, ClassVar
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict


class Analysis(BaseModel):
    """
    Analysis model for database representation
    """
    # Collection name in MongoDB
    collection: ClassVar[str] = "analyses"
    
    # Fields
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    description: Optional[str] = None
    property_id: str
    document_ids: List[str] = Field(default_factory=list)
    analysis_type: str  # e.g., "financial", "market", "comparables"
    parameters: Dict[str, Any] = Field(default_factory=dict)
    results: Dict[str, Any] = Field(default_factory=dict)
    status: str = "pending"  # pending, processing, completed, failed
    created_by: str  # User ID
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "title": "Financial Analysis",
                "description": "Cap rate and ROI analysis",
                "property_id": "5f8a3f2b9d3e2a1b8c7d6e5f",
                "analysis_type": "financial",
                "parameters": {
                    "cap_rate": 0.05,
                    "holding_period": 5
                }
            }
        }
    )
