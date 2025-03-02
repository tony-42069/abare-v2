"""
Property service for business logic related to properties
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate


async def get_properties(
    db: AsyncIOMotorDatabase,
    skip: int = 0,
    limit: int = 100
) -> List[Property]:
    """
    Get all properties with pagination
    """
    properties = []
    property_collection = db[Property.collection]
    
    cursor = property_collection.find().skip(skip).limit(limit)
    async for property_doc in cursor:
        properties.append(Property(**property_doc))
    
    return properties


async def get_property(
    db: AsyncIOMotorDatabase,
    property_id: str
) -> Optional[Property]:
    """
    Get a property by ID
    """
    property_collection = db[Property.collection]
    
    if not ObjectId.is_valid(property_id):
        return None
        
    property_doc = await property_collection.find_one({"_id": property_id})
    
    if property_doc:
        return Property(**property_doc)
    
    return None


async def create_property(
    db: AsyncIOMotorDatabase,
    property_data: PropertyCreate
) -> Property:
    """
    Create a new property
    """
    property_collection = db[Property.collection]
    
    # Create new property instance
    new_property = Property(
        name=property_data.name,
        property_type=property_data.property_type,
        property_class=property_data.property_class,
        year_built=property_data.year_built,
        total_sf=property_data.total_sf,
        status=property_data.status,
        description=property_data.description,
        features=property_data.features,
        address=property_data.address.model_dump(),
        financial_metrics=property_data.financial_metrics.model_dump() if property_data.financial_metrics else {},
        tenants=[tenant.model_dump() for tenant in property_data.tenants],
        document_ids=[]
    )
    
    # Insert into database
    property_dict = new_property.model_dump(by_alias=True)
    await property_collection.insert_one(property_dict)
    
    return new_property


async def update_property(
    db: AsyncIOMotorDatabase,
    property_id: str,
    property_data: PropertyUpdate
) -> Optional[Property]:
    """
    Update a property
    """
    property_collection = db[Property.collection]
    
    if not ObjectId.is_valid(property_id):
        return None
    
    # Get current property
    property_doc = await property_collection.find_one({"_id": property_id})
    if not property_doc:
        return None
    
    current_property = Property(**property_doc)
    
    # Prepare update data
    update_data = property_data.model_dump(exclude_unset=True)
    
    # Handle nested objects
    if "address" in update_data and update_data["address"]:
        update_data["address"] = update_data["address"].model_dump()
    
    if "financial_metrics" in update_data and update_data["financial_metrics"]:
        update_data["financial_metrics"] = update_data["financial_metrics"].model_dump()
    
    if "tenants" in update_data and update_data["tenants"]:
        update_data["tenants"] = [tenant.model_dump() for tenant in update_data["tenants"]]
    
    # Always update the updated_at field
    update_data["updated_at"] = datetime.utcnow()
    
    # Update in database
    await property_collection.update_one(
        {"_id": property_id},
        {"$set": update_data}
    )
    
    # Get updated property
    updated_property_doc = await property_collection.find_one({"_id": property_id})
    return Property(**updated_property_doc)


async def delete_property(
    db: AsyncIOMotorDatabase,
    property_id: str
) -> bool:
    """
    Delete a property
    """
    property_collection = db[Property.collection]
    
    if not ObjectId.is_valid(property_id):
        return False
    
    result = await property_collection.delete_one({"_id": property_id})
    
    return result.deleted_count > 0 