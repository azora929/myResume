from __future__ import annotations

import os
from typing import Any, Literal, Optional, Sequence
from dotenv import load_dotenv

from openai import OpenAI

from services.prompt_service import PromptService
from services.tool_call_service import handle_offer_tool
from services.tools_service import get_tools

ChatRole = Literal["user", "assistant"]

load_dotenv()


class OpenAIService:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise RuntimeError("OPENAI_API_KEY не задан")
        self.client = OpenAI(api_key=self.api_key)
        self.prompt_service = PromptService()

    def _execute_tool(self, name: str, arguments: str) -> str:
        if name == "send_job_offer":
            return handle_offer_tool(arguments)
        return "Неизвестная тулза."

    def get_completion(self, history: Sequence[dict[str, str]]) -> str:
        """history: список сообщений вида {'role': 'user'|'assistant', 'content': str}."""
        trimmed = list(history[-40:])
        system_prompt = self.prompt_service.build_system_prompt()
        tools = get_tools()
        input_list: list[dict[str, Any]] = [dict(item) for item in trimmed]
        max_rounds = 5

        for _ in range(max_rounds):
            response = self.client.responses.create(
                model="gpt-5-mini",
                input=input_list,
                instructions=system_prompt,
                tools=tools,
            )

            output_text = getattr(response, "output_text", None)
            if output_text and output_text.strip():
                return output_text.strip()

            output = getattr(response, "output", None) or []
            input_list.extend(output)

            has_function_call = False
            for item in output:
                if getattr(item, "type", None) == "function_call":
                    has_function_call = True
                    name = getattr(item, "name", "")
                    call_id = getattr(item, "call_id", "")
                    arguments = getattr(item, "arguments", "{}")
                    tool_result = self._execute_tool(name, arguments)
                    input_list.append({
                        "type": "function_call_output",
                        "call_id": call_id,
                        "output": tool_result,
                    })

            if not has_function_call:
                try:
                    first = output[0]
                    content = getattr(first, "content", None) or []
                    if content and hasattr(content[0], "text"):
                        return content[0].text.strip()
                except Exception:
                    pass
                return "Не знаю. Контакты: email dreminaleksandr06@gmail.com, Telegram https://t.me/azora929"

        return "Не удалось получить ответ. Попробуйте ещё раз."
