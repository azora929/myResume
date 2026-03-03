"""
Менеджер WebSocket-чата: каналы, комнаты и вся логика приёма/стриминга.
При подключении клиент получает room_id; сообщения стримятся в комнату.
"""
from __future__ import annotations

import asyncio
import json
import uuid
from typing import Any

from starlette.websockets import WebSocket

from services.openai_service import OpenAIService
from services.rate_limit_service import check_and_incr


def _client_ip(websocket: WebSocket) -> str:
    """IP подключающегося клиента (учёт X-Forwarded-For / X-Real-IP за прокси)."""
    headers = dict(websocket.scope.get("headers") or [])
    for key in (b"x-forwarded-for", b"x-real-ip"):
        raw = headers.get(key)
        if raw:
            if isinstance(raw, bytes):
                raw = raw.decode("utf-8", errors="replace")
            ip = raw.split(",")[0].strip() if key == b"x-forwarded-for" else raw.strip()
            if ip:
                return ip
    client = websocket.scope.get("client") or (None, None)
    if client[0]:
        return str(client[0])
    return str(uuid.uuid4())


class ChatConnectionManager:
    """Комнаты (room_id -> список WebSocket) и обработка соединения: коннект, приём сообщений, стриминг ответа."""

    def __init__(self) -> None:
        self._rooms: dict[str, list[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def join(self, room_id: str, websocket: WebSocket) -> None:
        """Добавить соединение в комнату."""
        async with self._lock:
            if room_id not in self._rooms:
                self._rooms[room_id] = []
            self._rooms[room_id].append(websocket)

    async def leave(self, room_id: str, websocket: WebSocket) -> None:
        """Убрать соединение из комнаты."""
        async with self._lock:
            if room_id not in self._rooms:
                return
            conns = self._rooms[room_id]
            try:
                conns.remove(websocket)
            except ValueError:
                pass
            if not conns:
                del self._rooms[room_id]

    def get_connections(self, room_id: str) -> list[WebSocket]:
        """Получить все соединения в комнате (без блокировки)."""
        return list(self._rooms.get(room_id, []))

    async def send_to_room(self, room_id: str, data: dict[str, Any]) -> bool:
        """Отправить JSON во все соединения комнаты. Возвращает True если хотя бы одно отправлено."""
        conns = self.get_connections(room_id)
        ok = False
        for ws in conns:
            try:
                await ws.send_json(data)
                ok = True
            except Exception:
                pass
        return ok

    async def handle_connection(self, websocket: WebSocket) -> None:
        """
        Полный цикл WebSocket: accept, комната, отправка connected,
        цикл приёма сообщений и стриминга ответа нейросети в комнату.
        """
        await websocket.accept()
        room_id = _client_ip(websocket)
        await self.join(room_id, websocket)
        try:
            await websocket.send_json({"type": "connected", "room_id": room_id})
        except Exception:
            await self.leave(room_id, websocket)
            return

        try:
            while True:
                raw = await websocket.receive_text()
                data = json.loads(raw)
                if data.get("type") != "message":
                    continue

                history = data.get("history") or []
                text = (data.get("text") or "").strip()
                if not text:
                    await self.send_to_room(room_id, {"type": "error", "text": "Пустое сообщение."})
                    continue
                history = list(history[-40:]) + [{"role": "user", "content": text}]

                allowed = await check_and_incr(room_id)
                if not allowed:
                    await self.send_to_room(
                        room_id,
                        {
                            "type": "limit_reached",
                            "text": "Достигнут лимит сообщений за сутки (40). Попробуйте завтра.",
                        },
                    )
                    continue

                try:
                    service = OpenAIService()
                    stream = service.stream_completion(history)
                except Exception:
                    await self.send_to_room(room_id, {"type": "error", "text": "Не удалось получить ответ. Попробуйте ещё раз."})
                    continue

                while True:
                    try:
                        kind, payload = await asyncio.to_thread(next, stream)
                    except StopIteration:
                        break
                    except Exception:
                        await self.send_to_room(room_id, {"type": "error", "text": "Не удалось получить ответ. Попробуйте ещё раз."})
                        break

                    if kind == "chunk":
                        await self.send_to_room(room_id, {"type": "chunk", "text": payload})
                    elif kind == "done":
                        await self.send_to_room(room_id, {"type": "done"})
                        break
                    elif kind == "error":
                        await self.send_to_room(room_id, {"type": "error", "text": payload})
                        break
        except Exception:
            pass
        finally:
            await self.leave(room_id, websocket)
            try:
                await websocket.close()
            except Exception:
                pass
