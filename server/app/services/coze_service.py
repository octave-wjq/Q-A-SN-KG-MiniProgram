from typing import Any

import httpx

from app.config import Settings, get_settings


class CozeService:
    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings or get_settings()

    async def chat(self, question: str, user_id: str = "default") -> dict[str, Any]:
        if not self._settings.COZE_BOT_ID or not self._settings.COZE_ACCESS_TOKEN:
            return {
                "answer": "Coze 服务尚未配置",
                "sources": [],
                "evidenceLevel": "待核实",
            }

        url = f"{self._settings.COZE_API_BASE.rstrip('/')}/chat/completions"
        payload = {
            "bot_id": self._settings.COZE_BOT_ID,
            "user_id": user_id,
            "messages": [{"role": "user", "content": question}],
            "stream": False,
        }
        headers = {
            "Authorization": f"Bearer {self._settings.COZE_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()

        response_data = response.json()
        answer = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")

        return {
            "answer": answer,
            "sources": [],
            "evidenceLevel": "待核实",
        }


coze_service = CozeService()
