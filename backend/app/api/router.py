"""
Main API router that combines all feature-specific routers
"""
from fastapi import APIRouter

# Import feature-specific routers
from app.api.auth.router import router as auth_router
from app.api.properties.router import router as properties_router
from app.api.documents.router import router as documents_router
from app.api.analyses.router import router as analyses_router

# Create main API router
api_router = APIRouter()

# Include feature-specific routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(properties_router, prefix="/properties", tags=["properties"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(analyses_router, prefix="/analyses", tags=["analyses"]) 