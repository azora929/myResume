from __future__ import annotations

import os
from typing import Literal, Optional, Sequence
from dotenv import load_dotenv


from openai import OpenAI

from services.prompt_service import PromptService


ChatRole = Literal["user", "assistant"]

load_dotenv()


class OpenAIService:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise RuntimeError("OPENAI_API_KEY не задан")
        self.client = OpenAI(api_key=self.api_key)
        self.prompt_service = PromptService()

    def get_completion(self, history: Sequence[dict[str, str]]) -> str:
        """history: список сообщений вида {'role': 'user'|'assistant', 'content': str}."""
        trimmed = list(history[-40:])  # safety: максимум 40 сообщений

        system_prompt = self.prompt_service.build_system_prompt()

        response = self.client.responses.create(
            model="gpt-5-mini",
            input=trimmed,
            instructions=system_prompt,
        )

        output_text = getattr(response, "output_text", None)
        if output_text:
            return output_text.strip()

        try:
            return response.output[0].content[0].text.strip()
        except Exception:
            return "Не знаю. Контакты: email dreminaleksandr06@gmail.com, Telegram https://t.me/azora929"
