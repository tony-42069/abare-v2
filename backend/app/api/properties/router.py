"""
Properties API endpoints for the ABARE Platform
"""
from fastapi import APIRouter, Depends, HTTPException, status, Path
from typing import List

# Import models and schemas
from app.schemas.property import Property, PropertyCreate, PropertyUpdate
from app.schemas.user import UserInDB
from app.services.property import (
    get_properties,
    get_property,
    create_property,
    update_property,
    delete_property
)

# Import dependencies
from app.deps import get_db, get_current_active_user

# Create router
router = APIRouter()


@router.get("/", response_model=List[Property])
async def list_properties(
    skip: int = 0,
    limit: int = 100,
    db = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    List all properties.
    """
    properties = await get_properties(db, skip=skip, limit=limit)
    return properties


@router.post("/", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_new_property(
    property_data: PropertyCreate,
    db = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Create a new property.
    """
    property_obj = await create_property(db, property_data)
    return property_obj


@router.get("/{property_id}", response_model=Property)
async def get_property_by_id(
    property_id: str = Path(..., title="The ID of the property to get"),
    db = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Get a property by ID.
    """
    property_obj = await get_property(db, property_id)
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    return property_obj


@router.put("/{property_id}", response_model=Property)
async def update_property_by_id(
    property_data: PropertyUpdate,
    property_id: str = Path(..., title="The ID of the property to update"),
    db = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Update a property.
    """
    updated_property = await update_property(db, property_id, property_data)
    if not updated_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    return updated_property


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_by_id(
    property_id: str = Path(..., title="The ID of the property to delete"),
    db = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Delete a property.
    """
    deleted = await delete_property(db, property_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with ID {property_id} not found"
        )
    return None
