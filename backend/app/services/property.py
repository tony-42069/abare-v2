"""
Property service for business logic related to properties
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

from app.models.property import Property as PropertyModel
from app.schemas.property import Property, PropertyCreate, PropertyUpdate


async def get_properties(
    db: Any,
    skip: int = 0,
    limit: int = 100
) -> List[Property]:
    """
    Get all properties with pagination
    """
    properties = []
    property_collection = db[PropertyModel.collection]
    
    # Handle both MongoDB and in-memory DB
    if hasattr(property_collection, "find"):
        cursor = property_collection.find().skip(skip).limit(limit)
        async for property_doc in cursor:
            property_doc["id"] = property_doc.pop("_id")
            properties.append(Property(**property_doc))
    else:
        # In-memory DB
        all_properties = await property_collection.find({})
        for property_doc in all_properties[skip:skip+limit]:
            property_doc["id"] = property_doc.pop("_id")
            properties.append(Property(**property_doc))
    
    return properties


async def get_property(
    db: Any,
    property_id: str
) -> Optional[Property]:
    """
    Get a property by ID
    """
    property_collection = db[PropertyModel.collection]
    
    property_doc = await property_collection.find_one({"_id": property_id})
    
    if property_doc:
        property_doc["id"] = property_doc.pop("_id")
        return Property(**property_doc)
    
    return None


async def create_property(
    db: Any,
    property_data: PropertyCreate
) -> Property:
    """
    Create a new property
    """
    property_collection = db[PropertyModel.collection]
    
    # Generate a new ID
    property_id = str(ObjectId())
    
    # Prepare property data
    property_dict = property_data.model_dump()
    property_dict.update({
        "_id": property_id,
        "document_ids": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Convert nested objects to dictionaries
    if "address" in property_dict and property_dict["address"]:
        property_dict["address"] = property_dict["address"].model_dump() if hasattr(property_dict["address"], "model_dump") else property_dict["address"]
    
    if "financial_metrics" in property_dict and property_dict["financial_metrics"]:
        property_dict["financial_metrics"] = property_dict["financial_metrics"].model_dump() if hasattr(property_dict["financial_metrics"], "model_dump") else property_dict["financial_metrics"]
    
    if "tenants" in property_dict and property_dict["tenants"]:
        property_dict["tenants"] = [tenant.model_dump() if hasattr(tenant, "model_dump") else tenant for tenant in property_dict["tenants"]]
    
    # Insert into database
    await property_collection.insert_one(property_dict)
    
    # Return the created property
    property_dict["id"] = property_dict.pop("_id")
    return Property(**property_dict)


async def update_property(
    db: Any,
    property_id: str,
    property_data: PropertyUpdate
) -> Optional[Property]:
    """
    Update a property
    """
    property_collection = db[PropertyModel.collection]
    
    # Get current property
    property_doc = await property_collection.find_one({"_id": property_id})
    if not property_doc:
        return None
    
    # Prepare update data
    update_data = property_data.model_dump(exclude_unset=True)
    
    # Handle nested objects
    if "address" in update_data and update_data["address"]:
        update_data["address"] = update_data["address"].model_dump() if hasattr(update_data["address"], "model_dump") else update_data["address"]
    
    if "financial_metrics" in update_data and update_data["financial_metrics"]:
        update_data["financial_metrics"] = update_data["financial_metrics"].model_dump() if hasattr(update_data["financial_metrics"], "model_dump") else update_data["financial_metrics"]
    
    if "tenants" in update_data and update_data["tenants"]:
        update_data["tenants"] = [tenant.model_dump() if hasattr(tenant, "model_dump") else tenant for tenant in update_data["tenants"]]
    
    # Always update the updated_at field
    update_data["updated_at"] = datetime.utcnow()
    
    # Update in database
    await property_collection.update_one(
        {"_id": property_id},
        {"$set": update_data}
    )
    
    # Get updated property
    updated_property_doc = await property_collection.find_one({"_id": property_id})
    updated_property_doc["id"] = updated_property_doc.pop("_id")
    return Property(**updated_property_doc)


async def delete_property(
    db: Any,
    property_id: str
) -> bool:
    """
    Delete a property
    """
    property_collection = db[PropertyModel.collection]
    
    result = await property_collection.delete_one({"_id": property_id})
    
    # Handle both MongoDB and in-memory DB
    if hasattr(result, "deleted_count"):
        return result.deleted_count > 0
    else:
        return result.get("deleted_count", 0) > 0
