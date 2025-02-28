"""
Authentication service for user management and token handling
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt
from passlib.context import CryptContext
from bson import ObjectId

# Import local modules
from app.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, UserUpdate

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plain password matches a hashed password
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password for storage
    """
    return pwd_context.hash(password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt


async def authenticate_user(db, email: str, password: str) -> Optional[UserInDB]:
    """
    Authenticate a user by email and password
    """
    user_collection = db[User.collection]
    user = await user_collection.find_one({"email": email})
    
    if not user:
        return None
    
    if not verify_password(password, user["hashed_password"]):
        return None
    
    # Update last login time
    now = datetime.utcnow()
    await user_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": now}}
    )
    
    user["last_login"] = now
    return UserInDB(**user)


async def create_user(db, user_data: UserCreate) -> UserInDB:
    """
    Create a new user
    """
    user_collection = db[User.collection]
    
    # Check if user already exists
    existing_user = await user_collection.find_one({"email": user_data.email})
    if existing_user:
        raise ValueError("Email already registered")
    
    # Create new user document
    user_dict = user_data.dict(exclude={"password"})
    hashed_password = get_password_hash(user_data.password)
    
    now = datetime.utcnow()
    user_dict.update({
        "_id": str(ObjectId()),
        "hashed_password": hashed_password,
        "created_at": now,
        "updated_at": now,
    })
    
    # Insert user document
    result = await user_collection.insert_one(user_dict)
    
    # Retrieve created user
    created_user = await user_collection.find_one({"_id": user_dict["_id"]})
    
    return UserInDB(**created_user)


async def update_user(db, user_id: str, user_data: UserUpdate) -> Optional[UserInDB]:
    """
    Update an existing user
    """
    user_collection = db[User.collection]
    
    # Check if user exists
    existing_user = await user_collection.find_one({"_id": user_id})
    if not existing_user:
        return None
    
    # Prepare update data
    update_data = user_data.dict(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Update timestamps
    update_data["updated_at"] = datetime.utcnow()
    
    # Update user document
    await user_collection.update_one(
        {"_id": user_id},
        {"$set": update_data}
    )
    
    # Retrieve updated user
    updated_user = await user_collection.find_one({"_id": user_id})
    
    return UserInDB(**updated_user)


async def get_user(db, user_id: str) -> Optional[UserInDB]:
    """
    Get a user by ID
    """
    user_collection = db[User.collection]
    user = await user_collection.find_one({"_id": user_id})
    
    if not user:
        return None
    
    return UserInDB(**user)


async def get_user_by_email(db, email: str) -> Optional[UserInDB]:
    """
    Get a user by email
    """
    user_collection = db[User.collection]
    user = await user_collection.find_one({"email": email})
    
    if not user:
        return None
    
    return UserInDB(**user) 