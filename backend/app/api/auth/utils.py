"""
Authentication utility functions for the ABARE Platform
"""
from typing import Optional, Dict, Any


def extract_token_from_header(authorization_header: Optional[str]) -> Optional[str]:
    """
    Extract JWT token from HTTP Authorization header
    
    Args:
        authorization_header: HTTP Authorization header value
        
    Returns:
        Extracted token or None if not found/invalid
    """
    if not authorization_header:
        return None
    
    parts = authorization_header.split()
    
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    return parts[1] 