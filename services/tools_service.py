"""Сервис тулз для чата с нейросетью: определения схем (без логики вызова)."""

from __future__ import annotations


def get_offer_tool_definition() -> dict:
    """Схема тулзы «отправить оффер»: при вызове кандидату отправляется оффер от работодателя."""
    return {
        "type": "function",
        "name": "send_job_offer",
        "description": (
            "При вызове этой тулзы кандидату отправляется оффер от работодателя. "
            "Используй, когда работодатель хочет связаться и отправить оффер (вилку, контакты, компанию)."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "salary_range": {
                    "type": "string",
                    "description": "Зарплатная вилка (например: 150 000 — 200 000 ₽).",
                },
                "contacts": {
                    "type": "string",
                    "description": "Куда писать кандидату: email, телеграм, ссылка на вакансию и т.п.",
                },
                "company": {
                    "type": "string",
                    "description": "Название и кратко что за компания.",
                },
                "comment": {
                    "type": "string",
                    "description": "Необязательный комментарий к офферу (пожелания, детали, когда созвониться и т.п.).",
                },
            },
            "required": ["salary_range", "contacts", "company"],
        },
    }


def get_tools() -> list[dict]:
    """Список тулз для передачи в API чата."""
    return [get_offer_tool_definition()]
