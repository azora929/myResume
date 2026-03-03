"""
Менеджер подключений чата: channel + комнаты.
При подключении клиент получает room_id и все сообщения для этой сессии идут в комнату.
"""
from __future__ import annotations

import asyncio
from typing import Any

from starlette.websockets import WebSocket


class ChatConnectionManager:
    """Хранит комнаты: room_id -> список WebSocket (канал). Один юзер = одна комната с одним соединением."""

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
        """Отправить JSON в все соединения комнаты. Возвращает True если хотя бы одно отправлено."""
        conns = self.get_connections(room_id)
        ok = False
        for ws in conns:
            try:
                await ws.send_json(data)
                ok = True
            except Exception:
                pass
        return ok
