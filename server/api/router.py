
# api/router.py
from fastapi import APIRouter
from api.endpoints import classify

api_router = APIRouter()

# '/api/v1' prefix ke saath classify endpoint ko include karna
api_router.include_router(classify.router, prefix="/v1", tags=["Classification"])