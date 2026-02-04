# api/endpoints/classify.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from services import classification_service

router = APIRouter()

@router.post("/classify-media")
async def classify_media(media_file: UploadFile = File(...)):
    """
    Receives a media file (audio or video) and classifies its genre.
    """

    contents = await media_file.read()

    if media_file.content_type.startswith("audio/"):
        result = await classification_service.classify_audio_genre(contents)

    elif media_file.content_type.startswith("video/"):
        result = await classification_service.classify_video_genre(contents)

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload an audio or video file."
        )

    # ✅ Unified, frontend-safe response
    response = {
        "filename": media_file.filename,
        "genre": result.get("genre"),
        "confidence": result.get("confidence", 0),
        "top_3_genres": result.get("top_3_genres", []),
        "has_audio": result.get("has_audio", False),
    }

    return response
