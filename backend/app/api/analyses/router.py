"""
Analyses API endpoints for the ABARE Platform
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
from bson import ObjectId

from app.deps import get_db, get_current_active_user
from app.models.analysis import Analysis as AnalysisModel
from app.models.property import Property as PropertyModel
from app.schemas.analysis import Analysis, AnalysisCreate, AnalysisUpdate, AnalysisResult
from app.schemas.user import UserInDB

router = APIRouter()
logger = logging.getLogger(__name__)


def calculate_cap_rate(noi: float, property_value: float) -> float:
    """Calculate cap rate from NOI and property value"""
    if property_value == 0:
        return 0
    return (noi / property_value) * 100


def calculate_price_per_sf(property_value: float, total_sf: float) -> float:
    """Calculate price per square foot"""
    if total_sf == 0:
        return 0
    return property_value / total_sf


@router.get("/", response_model=List[Analysis])
async def list_analyses(
    property_id: Optional[str] = None,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Retrieve all analyses, optionally filtered by property_id
    """
    query = {}
    if property_id:
        query["property_id"] = property_id
        
    analyses = await db[AnalysisModel.collection].find(query).to_list(1000)
    return analyses


@router.post("/", response_model=Analysis)
async def create_analysis(
    analysis_create: AnalysisCreate,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Create a new analysis
    """
    # Verify property exists
    property_doc = await db[PropertyModel.collection].find_one({"_id": analysis_create.property_id})
    if not property_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    analysis = analysis_create.model_dump()
    analysis.update({
        "_id": str(ObjectId()),
        "status": "pending",
        "results": {},
        "created_by": current_user.id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    await db[AnalysisModel.collection].insert_one(analysis)
    
    # Schedule analysis processing in background
    # background_tasks.add_task(run_analysis, analysis["_id"])
    
    return analysis


@router.get("/{analysis_id}", response_model=Analysis)
async def get_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Retrieve an analysis by ID
    """
    analysis = await db[AnalysisModel.collection].find_one({"_id": analysis_id})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    return analysis


@router.put("/{analysis_id}", response_model=Analysis)
async def update_analysis(
    analysis_id: str,
    analysis_update: AnalysisUpdate,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Update analysis metadata
    """
    analysis = await db[AnalysisModel.collection].find_one({"_id": analysis_id})
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
        await db[AnalysisModel.collection].update_one(
            {"_id": analysis_id},
            {"$set": update_data}
        )
    
    updated_analysis = await db[AnalysisModel.collection].find_one({"_id": analysis_id})
    return updated_analysis


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Delete an analysis
    """
    analysis = await db[AnalysisModel.collection].find_one({"_id": analysis_id})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    await db[AnalysisModel.collection].delete_one({"_id": analysis_id})
    return None


@router.post("/{analysis_id}/process", response_model=AnalysisResult)
async def process_analysis(
    analysis_id: str,
    db=Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """
    Run the analysis processing
    """
    analysis = await db[AnalysisModel.collection].find_one({"_id": analysis_id})
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Get property data for analysis
    property_doc = await db[PropertyModel.collection].find_one({"_id": analysis["property_id"]})
    if not property_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Calculate financial metrics
    noi = property_doc.get("financial_metrics", {}).get("noi", 0)
    property_value = property_doc.get("financial_metrics", {}).get("property_value", 0)
    total_sf = property_doc.get("total_sf", 0)
    
    cap_rate = calculate_cap_rate(noi, property_value)
    price_per_sf = calculate_price_per_sf(property_value, total_sf)
    
    # Generate analysis results
    results = {
        "noi": noi,
        "property_value": property_value,
        "cap_rate": cap_rate,
        "price_per_sf": price_per_sf,
        "total_sf": total_sf,
        "analysis_summary": f"Property has a cap rate of {cap_rate:.2f}% and price per SF of ${price_per_sf:.2f}."
    }
    
    # Add additional metrics based on analysis type
    if analysis["analysis_type"] == "financial":
        # Add more financial metrics
        occupancy = property_doc.get("financial_metrics", {}).get("occupancy_rate", 0)
        results["occupancy_rate"] = occupancy
        results["vacancy_loss"] = noi * (1 - occupancy/100) if occupancy > 0 else 0
    
    # Update analysis with results
    now = datetime.utcnow()
    await db[AnalysisModel.collection].update_one(
        {"_id": analysis_id},
        {"$set": {
            "results": results, 
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
        "results": results,
        "completed_at": now,
        "message": "Analysis completed successfully"
    }
