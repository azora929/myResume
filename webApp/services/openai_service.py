from __future__ import annotations

import json
import os
from typing import Any, Iterator, Literal, Optional, Sequence
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

    def stream_completion(
        self, history: Sequence[dict[str, str]]
    ) -> Iterator[tuple[str, str]]:
        """
        Стримит ответ нейросети. Yields ("chunk", text) для каждого куска текста,
        ("tool_result", message) при вызове тулзы, ("done", "") в конце.
        """
        trimmed = list(history[-40:])
        system_prompt = self.prompt_service.build_system_prompt()
        tools = get_tools()
        input_list: list[dict[str, Any]] = [dict(item) for item in trimmed]
        max_rounds = 5

        for _ in range(max_rounds):
            try:
                stream = self.client.responses.create(
                    model="gpt-5-mini",
                    input=input_list,
                    instructions=system_prompt,
                    tools=tools,
                    stream=True,
                )
            except Exception:
                yield ("error", "Не удалось получить ответ. Попробуйте ещё раз.")
                return

            accumulated_text = ""
            function_call_name: Optional[str] = None
            function_call_id: Optional[str] = None
            function_call_args: list[str] = []

            for event in stream:
                event_type = getattr(event, "type", None) or ""
                if event_type == "response.output_text.delta":
                    delta = getattr(event, "delta", None) or getattr(event, "text", None)
                    if delta and isinstance(delta, str):
                        accumulated_text += delta
                        yield ("chunk", delta)
                elif event_type == "response.function_call_arguments.delta":
                    delta = getattr(event, "delta", None) or ""
                    if isinstance(delta, str):
                        function_call_args.append(delta)
                elif "function_call" in event_type and hasattr(event, "name"):
                    function_call_name = getattr(event, "name", None)
                    function_call_id = getattr(event, "call_id", None)
                elif event_type == "response.completed":
                    break

            if function_call_name and function_call_id is not None:
                arguments_str = "".join(function_call_args) if function_call_args else "{}"
                try:
                    tool_result = self._execute_tool(function_call_name, arguments_str)
                except Exception:
                    tool_result = "Ошибка выполнения."
                input_list.append({
                    "type": "function_call_output",
                    "call_id": function_call_id,
                    "output": tool_result,
                })
                yield ("tool_result", tool_result)
                continue

            if accumulated_text.strip():
                yield ("done", "")
                return

            try:
                response = self.client.responses.create(
                    model="gpt-5-mini",
                    input=input_list,
                    instructions=system_prompt,
                    tools=tools,
                )
                output = getattr(response, "output", None) or []
                input_list.extend(output)
                has_function_call = False
                for item in output:
                    if getattr(item, "type", None) == "function_call":
                        has_function_call = True
                        name = getattr(item, "name", "")
                        call_id = getattr(item, "call_id", "")
                        arguments = getattr(item, "arguments", "{}")
                        if isinstance(arguments, dict):
                            arguments = json.dumps(arguments, ensure_ascii=False)
                        tool_result = self._execute_tool(name, arguments)
                        input_list.append({
                            "type": "function_call_output",
                            "call_id": call_id,
                            "output": tool_result,
                        })
                        yield ("tool_result", tool_result)
                if not has_function_call:
                    output_text = getattr(response, "output_text", None)
                    if output_text and str(output_text).strip():
                        yield ("chunk", str(output_text).strip())
                    yield ("done", "")
                    return
            except Exception:
                yield ("error", "Не удалось получить ответ. Попробуйте ещё раз.")
                return

        yield ("done", "")