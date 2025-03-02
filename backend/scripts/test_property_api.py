"""
Script to manually test the Property API
"""
import asyncio
import httpx
import json
from typing import Dict, Any

# Constants
API_URL = "http://localhost:8000/api/properties"
AUTH_URL = "http://localhost:8000/api/auth/token"

# Test user credentials - replace with your own user if needed
TEST_USER = "testuser@example.com"
TEST_PASSWORD = "Password123"

# Sample property data
sample_property = {
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
    """Get authentication token"""
    form_data = {
        "username": TEST_USER,
        "password": TEST_PASSWORD
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            AUTH_URL,
            data=form_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code != 200:
            print(f"Error getting token: {response.status_code}")
            print(response.text)
            raise Exception("Authentication failed")
        
        token_data = response.json()
        return token_data["access_token"]


async def create_property(token: str) -> str:
    """Create a new property"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            API_URL,
            json=sample_property,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 201:
            print(f"Error creating property: {response.status_code}")
            print(response.text)
            raise Exception("Failed to create property")
        
        property_data = response.json()
        property_id = property_data["id"]
        print(f"Created property with ID: {property_id}")
        return property_id


async def get_properties(token: str):
    """Get all properties"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            API_URL,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            print(f"Error getting properties: {response.status_code}")
            print(response.text)
            raise Exception("Failed to get properties")
        
        properties = response.json()
        print(f"Found {len(properties)} properties:")
        for prop in properties:
            print(f" - {prop['name']} (ID: {prop['id']})")
        
        return properties


async def get_property_by_id(token: str, property_id: str):
    """Get a property by ID"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_URL}/{property_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            print(f"Error getting property: {response.status_code}")
            print(response.text)
            raise Exception(f"Failed to get property {property_id}")
        
        property_data = response.json()
        print(f"Property details for {property_data['name']}:")
        print(json.dumps(property_data, indent=2))
        return property_data


async def update_property(token: str, property_id: str):
    """Update a property"""
    update_data = {
        "name": f"Updated Property {property_id}",
        "description": "This property has been updated via the API test script",
        "financial_metrics": {
            "noi": 550000,
            "cap_rate": 0.08
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{API_URL}/{property_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            print(f"Error updating property: {response.status_code}")
            print(response.text)
            raise Exception(f"Failed to update property {property_id}")
        
        property_data = response.json()
        print(f"Updated property {property_id}:")
        print(f" - New name: {property_data['name']}")
        print(f" - New description: {property_data['description']}")
        return property_data


async def delete_property(token: str, property_id: str):
    """Delete a property"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{API_URL}/{property_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 204:
            print(f"Error deleting property: {response.status_code}")
            print(response.text)
            raise Exception(f"Failed to delete property {property_id}")
        
        print(f"Property {property_id} deleted successfully")
        return True


async def main():
    """Main test function"""
    try:
        print("Getting authentication token...")
        token = await get_auth_token()
        
        print("\n--- Creating a new property ---")
        property_id = await create_property(token)
        
        print("\n--- Getting all properties ---")
        await get_properties(token)
        
        print("\n--- Getting property details ---")
        await get_property_by_id(token, property_id)
        
        print("\n--- Updating property ---")
        await update_property(token, property_id)
        
        print("\n--- Getting updated property details ---")
        await get_property_by_id(token, property_id)
        
        print("\n--- Deleting property ---")
        await delete_property(token, property_id)
        
        print("\n--- Verifying property was deleted ---")
        try:
            await get_property_by_id(token, property_id)
            print("Error: Property still exists after deletion!")
        except Exception:
            print("Verified: Property was successfully deleted")
        
        print("\nProperty API test completed successfully!")
        
    except Exception as e:
        print(f"Test failed: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main()) 