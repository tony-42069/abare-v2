"""
MongoDB connection and utility functions with in-memory fallback
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from typing import Dict, List, Optional, Any

# Import local modules
from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Global variables
mongodb_client: Optional[AsyncIOMotorClient] = None
in_memory_database: Dict[str, List[Dict[str, Any]]] = {}


async def get_database() -> Database:
    """
    Get MongoDB database connection.
    """
    global mongodb_client
    
    if not mongodb_client:
        if not settings.MONGODB_URL:
            raise ValueError("MONGODB_URL is not set")
        
        try:
            mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
            # Ping the database to check connection
            await mongodb_client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise
    
    return mongodb_client[settings.DATABASE_NAME]


def get_in_memory_db() -> Dict[str, List[Dict[str, Any]]]:
    """
    Get in-memory database (fallback if MongoDB is unavailable).
    This is a simple dictionary-based representation of collections and documents.
    
    Example structure:
    {
        "users": [{"_id": "1", "email": "user@example.com", ...}],
        "properties": [{"_id": "1", "name": "Property 1", ...}]
    }
    """
    global in_memory_database
    
    # Initialize default collections if they don't exist
    collections = ["users", "properties", "documents", "analyses"]
    for collection in collections:
        if collection not in in_memory_database:
            in_memory_database[collection] = []
    
    # Add wrapper methods to mimic MongoDB AsyncIO operations
    in_memory_db = InMemoryDatabaseWrapper(in_memory_database)
    
    return in_memory_db


class InMemoryDatabaseWrapper:
    """
    Wrapper for in-memory database to mimic MongoDB AsyncIO operations.
    """
    def __init__(self, data: Dict[str, List[Dict[str, Any]]]):
        self.data = data
    
    def __getitem__(self, collection_name: str):
        """
        Access a collection by name, creating it if it doesn't exist.
        """
        if collection_name not in self.data:
            self.data[collection_name] = []
        
        return InMemoryCollectionWrapper(self.data[collection_name])


class InMemoryCollectionWrapper:
    """
    Wrapper for in-memory collection to mimic MongoDB collection operations.
    """
    def __init__(self, collection_data: List[Dict[str, Any]]):
        self.collection_data = collection_data
    
    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Find a single document matching the query.
        """
        for doc in self.collection_data:
            if all(doc.get(k) == v for k, v in query.items()):
                return doc
        return None
    
    async def find(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Find all documents matching the query.
        """
        if query is None:
            return self.collection_data
        
        return [
            doc for doc in self.collection_data
            if all(doc.get(k) == v for k, v in query.items())
        ]
    
    async def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """
        Insert a document into the collection.
        """
        self.collection_data.append(document)
        return {"inserted_id": document.get("_id")}
    
    async def update_one(
        self, 
        query: Dict[str, Any],
        update: Dict[str, Any]
    ) -> Dict[str, int]:
        """
        Update a document in the collection.
        """
        for i, doc in enumerate(self.collection_data):
            if all(doc.get(k) == v for k, v in query.items()):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        self.collection_data[i][k] = v
                else:
                    for k, v in update.items():
                        self.collection_data[i][k] = v
                return {"modified_count": 1}
        
        return {"modified_count": 0}
    
    async def delete_one(self, query: Dict[str, Any]) -> Dict[str, int]:
        """
        Delete a document from the collection.
        """
        for i, doc in enumerate(self.collection_data):
            if all(doc.get(k) == v for k, v in query.items()):
                self.collection_data.pop(i)
                return {"deleted_count": 1}
        
        return {"deleted_count": 0} 