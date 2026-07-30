"""
Generic pagination schemas for list responses.
"""

from typing import Generic, List, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic schema for paginated responses."""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
