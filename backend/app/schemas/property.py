"""
Property schemas for request and response validation
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AddressSchema(BaseModel):
    """Schema for property address"""
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"


class FinancialMetricsSchema(BaseModel):
    """Schema for property financial metrics"""
    noi: Optional[float] = None
    cap_rate: Optional[float] = None
    occupancy_rate: Optional[float] = None
    property_value: Optional[float] = None
    price_per_sf: Optional[float] = None


class TenantSchema(BaseModel):
    """Schema for property tenant"""
    name: str
    lease_start: Optional[datetime] = None
    lease_end: Optional[datetime] = None
    sf_leased: Optional[float] = None
    monthly_rent: Optional[float] = None
    notes: Optional[str] = None


class PropertyBase(BaseModel):
    """Base property schema with common attributes"""
    name: str
    property_type: str
    property_class: Optional[str] = None
    year_built: Optional[int] = None
    total_sf: Optional[float] = None
    status: str = "active"
    description: Optional[str] = None
    features: List[str] = Field(default_factory=list)


class PropertyCreate(PropertyBase):
    """Schema for creating a new property"""
    address: AddressSchema
    financial_metrics: Optional[FinancialMetricsSchema] = None
    tenants: List[TenantSchema] = Field(default_factory=list)


class PropertyUpdate(BaseModel):
    """Schema for updating an existing property"""
    name: Optional[str] = None
    property_type: Optional[str] = None
    property_class: Optional[str] = None
    year_built: Optional[int] = None
    total_sf: Optional[float] = None
    status: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    address: Optional[AddressSchema] = None
    financial_metrics: Optional[FinancialMetricsSchema] = None
    tenants: Optional[List[TenantSchema]] = None


class PropertyInDB(PropertyBase):
    """Schema for property from database"""
    id: str = Field(..., alias="_id")
    address: Dict[str, str]
    financial_metrics: Dict[str, float]
    tenants: List[Dict[str, Any]]
    document_ids: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class Property(PropertyBase):
    """Schema for property response"""
    id: str
    address: Dict[str, str]
    financial_metrics: Dict[str, float]
    tenants: List[Dict[str, Any]]
    document_ids: List[str]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True
    )
