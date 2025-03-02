"""
Manual test script for the authentication API endpoints.
"""
import asyncio
import httpx
import json
from datetime import datetime


# Base API URL - change as needed
BASE_URL = "http://localhost:8000/api"

# Test user credentials
TEST_USER = {
    "email": "test@example.com",
    "password": "TestPassword123",
    "full_name": "Test User"
}

# Global variables
access_token = None


async def test_register():
    """Test user registration endpoint"""
    url = f"{BASE_URL}/auth/register"
    
    print(f"\n🔍 Testing registration at {url}")
    print(f"📄 Request body: {json.dumps(TEST_USER, indent=2)}")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url, 
            json=TEST_USER,
            timeout=10.0
        )
    
    data = response.json()
    print(f"📤 Response ({response.status_code}): {json.dumps(data, indent=2)}")
    
    assert response.status_code in [200, 201, 400], f"Registration failed with status {response.status_code}"
    
    if response.status_code == 400 and "Email already registered" in response.text:
        print("ℹ️ User already exists, continuing with login test")
        return True
    
    assert response.status_code in [200, 201], f"Registration failed with status {response.status_code}"
    return True


async def test_login():
    """Test user login endpoint"""
    global access_token
    url = f"{BASE_URL}/auth/login"
    
    print(f"\n🔍 Testing login at {url}")
    print(f"📄 Request body: {json.dumps({'email': TEST_USER['email'], 'password': TEST_USER['password']}, indent=2)}")
    
    login_data = {
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url, 
            json=login_data,
            timeout=10.0
        )
    
    data = response.json()
    print(f"📤 Response ({response.status_code}): {json.dumps(data, indent=2)}")
    
    assert response.status_code == 200, f"Login failed with status {response.status_code}"
    assert "access_token" in data, "Token not found in response"
    
    access_token = data["access_token"]
    return True


async def test_me():
    """Test the me endpoint (get current user)"""
    global access_token
    url = f"{BASE_URL}/auth/me"
    
    print(f"\n🔍 Testing 'me' endpoint at {url}")
    print(f"🔑 Authorization: Bearer {access_token[:20]}...")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0
        )
    
    data = response.json()
    print(f"📤 Response ({response.status_code}): {json.dumps(data, indent=2)}")
    
    assert response.status_code == 200, f"Get user info failed with status {response.status_code}"
    assert data["email"] == TEST_USER["email"], "Email in response doesn't match test user"
    
    return True


async def main():
    """Run all tests in sequence"""
    start_time = datetime.now()
    
    print(f"🚀 Starting authentication API tests at {start_time.isoformat()}")
    print(f"🔗 Base URL: {BASE_URL}")
    
    try:
        # Test registration
        await test_register()
        
        # Test login
        await test_login()
        
        # Test me endpoint
        await test_me()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print(f"\n✅ All tests passed! ({duration:.2f} seconds)")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        raise


if __name__ == "__main__":
    asyncio.run(main()) 