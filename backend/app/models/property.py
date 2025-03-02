"""
Property model for database representation
"""
from typing import Optional, List, Dict, Any, ClassVar
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict


class Property(BaseModel):
    """
    Property model for database representation
    """
    # Collection name in MongoDB
    collection: ClassVar[str] = "properties"
    
    # Fields
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    property_type: str
    property_class: Optional[str] = None
    year_built: Optional[int] = None
    total_sf: Optional[float] = None
    
    # Address
    address: Dict[str, str] = Field(default_factory=dict)
    # {street, city, state, zip_code, country}
    
    # Financial metrics
    financial_metrics: Dict[str, float] = Field(default_factory=dict)
    # {noi, cap_rate, occupancy_rate, property_value, price_per_sf}
    
    status: str = "active"
    description: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    tenants: List[Dict[str, Any]] = Field(default_factory=list)
    document_ids: List[str] = Field(default_factory=list)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Office Building",
                "property_type": "office",
                "property_class": "A",
                "year_built": 2010,
                "total_sf": 50000,
                "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "state": "NY",
                    "zip_code": "10001",
                    "country": "USA"
                }
            }
        }
    )
