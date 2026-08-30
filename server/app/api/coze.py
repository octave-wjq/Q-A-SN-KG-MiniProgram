from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.coze_service import coze_service
from app.utils.helpers import api_response

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    user_id: str = "default"


@router.post("/chat")
async def chat(payload: ChatRequest) -> dict[str, Any]:
    try:
        result = await coze_service.chat(question=payload.question, user_id=payload.user_id)
        return api_response(data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Coze chat failed: {exc}") from exc
