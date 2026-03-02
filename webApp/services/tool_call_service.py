"""Сервис обработки вызовов тулз: исполнение и ответы для модели."""

from __future__ import annotations

import json
from pathlib import Path

REQUIRED_OFFER_FIELDS = {
    "salary_range": "зарплатная вилка",
    "contacts": "контакты (куда писать)",
    "company": "компания",
}


def handle_offer_tool(arguments: str) -> str:
    """
    Обработчик вызова send_job_offer. Сохраняет оффер и возвращает сообщение для модели.
    """
    try:
        data = json.loads(arguments) if isinstance(arguments, str) else arguments
    except Exception:
        return "Не удалось разобрать данные оффера. Попросите указать вилку, контакты и компанию."

    if not isinstance(data, dict):
        return "Оффер должен содержать поля: зарплатная вилка, контакты, компания."

    missing = []
    for key, label in REQUIRED_OFFER_FIELDS.items():
        value = data.get(key)
        if value is None or (isinstance(value, str) and not value.strip()):
            missing.append(label)

    if missing:
        return f"Не хватает обязательных полей: {', '.join(missing)}. Попросите работодателя указать их и отправить оффер снова."

    salary = (data.get("salary_range") or "").strip()
    contacts = (data.get("contacts") or "").strip()
    company = (data.get("company") or "").strip()
    comment = (data.get("comment") or "").strip()

    offer = {
        "salary_range": salary,
        "contacts": contacts,
        "company": company,
    }
    if comment:
        offer["comment"] = comment

    try:
        offers_dir = Path(__file__).resolve().parent.parent / "data" / "offers"
        offers_dir.mkdir(parents=True, exist_ok=True)
        offer_file = offers_dir / "offers.jsonl"
        with open(offer_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(offer, ensure_ascii=False) + "\n")
    except Exception:
        return "Не удалось сохранить оффер. Попросите работодателя повторить позже."

    return "Оффер принят и отправлен кандидату. Кандидат получит его и свяжется по указанным контактам."
