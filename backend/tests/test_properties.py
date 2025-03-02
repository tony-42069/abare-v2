"""
Test module for Property API
"""
import pytest
import httpx
import json
from typing import Dict, Any

# Constants
API_URL = "http://localhost:8000/api/properties"
AUTH_URL = "http://localhost:8000/api/auth/token"

# Test data
test_user = {
    "username": "testuser@example.com",
    "password": "Password123"
}

test_property = {
    "name": "Riverside Office Park",
    "property_type": "Office",
    "property_class": "Class A",
    "year_built": 2010,
    "total_sf": 50000,
    "description": "Modern office park with river views",
    "features": ["River view", "Parking", "Security"],
    "address": {
        "street": "123 River Rd",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "country": "USA"
    },
    "financial_metrics": {
        "noi": 500000,
        "cap_rate": 0.075,
        "occupancy_rate": 0.95,
        "property_value": 6500000,
        "price_per_sf": 130
    },
    "tenants": []
}


async def get_auth_token() -> str:
    """Get authentication token for test user"""
    form_data = {
        "username": test_user["username"],
        "password": test_user["password"]
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            AUTH_URL,
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code != 200:
            raise Exception(f"Failed to get auth token: {response.text}")
        
        token_data = response.json()
        return token_data["access_token"]


@pytest.mark.asyncio
async def test_create_property():
    """Test creating a new property"""
    # Get auth token
    token = await get_auth_token()
    
    # Create property
    async with httpx.AsyncClient() as client:
        response = await client.post(
            API_URL,
            json=test_property,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 201
        
        property_data = response.json()
        assert property_data["name"] == test_property["name"]
        assert property_data["property_type"] == test_property["property_type"]
        assert "id" in property_data
        
        # Save property ID for other tests
        return property_data["id"]


@pytest.mark.asyncio
async def test_get_properties():
    """Test getting all properties"""
    # Get auth token
    token = await get_auth_token()
    
    # Get properties
    async with httpx.AsyncClient() as client:
        response = await client.get(
            API_URL,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        
        properties = response.json()
        assert isinstance(properties, list)
        
        # At least one property should be returned (the one we created)
        assert len(properties) > 0


@pytest.mark.asyncio
async def test_get_property():
    """Test getting a property by ID"""
    # Create a property first
    property_id = await test_create_property()
    
    # Get auth token
    token = await get_auth_token()
    
    # Get property
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_URL}/{property_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        
        property_data = response.json()
        assert property_data["id"] == property_id
        assert property_data["name"] == test_property["name"]


@pytest.mark.asyncio
async def test_update_property():
    """Test updating a property"""
    # Create a property first
    property_id = await test_create_property()
    
    # Get auth token
    token = await get_auth_token()
    
    # Update data
    update_data = {
        "name": "Updated Riverside Office Park",
        "total_sf": 55000
    }
    
    # Update property
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{API_URL}/{property_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        
        property_data = response.json()
        assert property_data["id"] == property_id
        assert property_data["name"] == update_data["name"]
        assert property_data["total_sf"] == update_data["total_sf"]


@pytest.mark.asyncio
async def test_delete_property():
    """Test deleting a property"""
    # Create a property first
    property_id = await test_create_property()
    
    # Get auth token
    token = await get_auth_token()
    
    # Delete property
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{API_URL}/{property_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 204
        
        # Try to get the deleted property
        get_response = await client.get(
            f"{API_URL}/{property_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Should return 404
        assert get_response.status_code == 404 