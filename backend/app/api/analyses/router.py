"""
Analyses API endpoints for the ABARE Platform
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
from bson import ObjectId

from app.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.analysis import Analysis, AnalysisCreate, AnalysisUpdate, AnalysisResult

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[Analysis])
async def list_analyses(
    property_id: Optional[str] = None,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieve all analyses, optionally filtered by property_id
    """
    query = {}
    if property_id:
        query["property_id"] = property_id
        
    analyses = await db["analyses"].find(query).to_list(1000)
    return analyses


@router.post("/", response_model=Analysis)
async def create_analysis(
    analysis_create: AnalysisCreate,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new analysis
    """
    analysis = analysis_create.model_dump()
    analysis.update({
        "status": "pending",
        "results": {},
        "created_by": str(current_user.id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db["analyses"].insert_one(analysis)
    analysis["_id"] = str(result.inserted_id)
    
    # Schedule analysis processing in background
    # background_tasks.add_task(run_analysis, analysis["_id"])
    
    return analysis


@router.get("/{analysis_id}", response_model=Analysis)
async def get_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieve an analysis by ID
    """
    analysis = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    analysis["_id"] = str(analysis["_id"])
    return analysis


@router.put("/{analysis_id}", response_model=Analysis)
async def update_analysis(
    analysis_id: str,
    analysis_update: AnalysisUpdate,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update analysis metadata
    """
    analysis = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Check if analysis is already completed
    if analysis.get("status") == "completed" and "status" in analysis_update.model_dump(exclude_unset=True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update a completed analysis"
        )
    
    update_data = analysis_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db["analyses"].update_one(
            {"_id": ObjectId(analysis_id)},
            {"$set": update_data}
        )
    
    updated_analysis = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
    updated_analysis["_id"] = str(updated_analysis["_id"])
    return updated_analysis


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete an analysis
    """
    analysis = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    await db["analyses"].delete_one({"_id": ObjectId(analysis_id)})
    return None


@router.post("/{analysis_id}/process", response_model=AnalysisResult)
async def process_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Run the analysis processing
    """
    analysis = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # In MVP, we'll just simulate processing with some sample results
    mock_results = {
        "sample_metric_1": 0.85,
        "sample_metric_2": 125.7,
        "text_summary": "This is a placeholder for analysis results."
    }
    
    # Update analysis with mock results
    now = datetime.utcnow()
    await db["analyses"].update_one(
        {"_id": ObjectId(analysis_id)},
        {"$set": {
            "results": mock_results, 
            "status": "completed", 
            "updated_at": now,
            "completed_at": now
        }}
    )
    
    # Return analysis result
    return {
        "id": analysis_id,
        "title": analysis["title"],
        "status": "completed",
        "analysis_type": analysis["analysis_type"],
        "results": mock_results,
        "completed_at": now,
        "message": "Analysis completed successfully"
    } 