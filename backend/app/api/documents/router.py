"""
Documents API endpoints for the ABARE Platform
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from typing import List, Optional
import os
import shutil
import logging
from datetime import datetime
from bson import ObjectId

# Import local modules
from app.deps import get_db, get_current_active_user
from app.config import settings
from app.models.document import Document as DocumentModel
from app.schemas.document import Document, DocumentCreate, DocumentUpdate, DocumentUploadResult
from app.schemas.user import UserInDB

# Create router
router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Document])
async def list_documents(
    property_id: Optional[str] = None,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Retrieve all documents, optionally filtered by property_id
    """
    query = {}
    if property_id:
        query["property_id"] = property_id
        
    documents = await db[DocumentModel.collection].find(query)
    
    # Handle in-memory DB vs MongoDB
    if hasattr(documents, "to_list"):
        documents = await documents.to_list(1000)
    
    return documents


@router.post("/upload", response_model=DocumentUploadResult)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = None,
    description: Optional[str] = None,
    property_id: Optional[str] = None,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Upload a new document
    """
    if not title:
        title = file.filename
        
    # Create uploads directory if it doesn't exist
    upload_dir = settings.UPLOAD_DIRECTORY
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate a unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save file"
        )
    
    # Create document record
    document = {
        "_id": str(ObjectId()),
        "title": title,
        "description": description,
        "property_id": property_id,
        "file_path": file_path,
        "file_size": os.path.getsize(file_path),
        "file_type": file.content_type,
        "uploaded_by": current_user.id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db[DocumentModel.collection].insert_one(document)
    
    # Add processing task to background
    # background_tasks.add_task(process_document, document["_id"], file_path)
    
    return {
        "id": document["_id"],
        "title": title,
        "file_type": file.content_type,
        "file_size": document["file_size"],
        "upload_success": True,
        "message": "File uploaded successfully"
    }


@router.get("/{document_id}", response_model=Document)
async def get_document(
    document_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Retrieve a document by ID
    """
    document = await db[DocumentModel.collection].find_one({"_id": document_id})
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return document


@router.put("/{document_id}", response_model=Document)
async def update_document(
    document_id: str,
    document_update: DocumentUpdate,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Update document metadata
    """
    document = await db[DocumentModel.collection].find_one({"_id": document_id})
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    update_data = document_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db[DocumentModel.collection].update_one(
            {"_id": document_id},
            {"$set": update_data}
        )
    
    updated_document = await db[DocumentModel.collection].find_one({"_id": document_id})
    return updated_document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Delete a document
    """
    document = await db[DocumentModel.collection].find_one({"_id": document_id})
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete the file if it exists
    try:
        if os.path.exists(document["file_path"]):
            os.remove(document["file_path"])
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
    
    # Delete the document record
    await db[DocumentModel.collection].delete_one({"_id": document_id})
    
    return None


@router.post("/{document_id}/process", response_model=Document)
async def process_document(
    document_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Process a document for data extraction
    """
    document = await db[DocumentModel.collection].find_one({"_id": document_id})
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # In MVP, we'll just mark it as processed
    await db[DocumentModel.collection].update_one(
        {"_id": document_id},
        {"$set": {"processed": True, "updated_at": datetime.utcnow()}}
    )
    
    updated_document = await db[DocumentModel.collection].find_one({"_id": document_id})
    return updated_document
