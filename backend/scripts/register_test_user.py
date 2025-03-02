"""
Script to register a test user for API testing
"""
import asyncio
import httpx
import json

# Constants
API_URL = "http://localhost:8000/api/auth/register"

# Test user data
test_user = {
    "email": "testuser@example.com",
    "password": "Password123",
    "full_name": "Test User"
}


async def register_user():
    """Register a test user"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            API_URL,
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("User registered successfully!")
        else:
            print("Failed to register user")


if __name__ == "__main__":
    asyncio.run(register_user()) 