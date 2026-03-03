import asyncio
import json
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from starlette.websockets import WebSocket

from services.chat_connection_manager import ChatConnectionManager
from services.openai_service import OpenAIService
from services.pdf_handler import PdfRenderHandler


# Один менеджер на приложение: каналы + комнаты по room_id
chat_manager = ChatConnectionManager()


class ApiRouter:
    def __init__(self) -> None:
        self.router = APIRouter(prefix="/api", tags=["api"])
        self.router.get("/pdf")(self.generate_pdf)
        self.router.websocket("/ws/chat")(self.ws_chat)

    @staticmethod
    def _safe_unlink(path: Path) -> None:
        try:
            path.unlink(missing_ok=True)
        except Exception:
            pass

    def generate_pdf(self, background_tasks: BackgroundTasks) -> FileResponse:
        handler = PdfRenderHandler()
        try:
            pdf_path = handler.render_random_pdf()
        except Exception:
            raise HTTPException(status_code=500, detail="Не удалось сформировать PDF. Попробуйте ещё раз.")

        background_tasks.add_task(self._safe_unlink, pdf_path)
        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename="resume.pdf",
            background=background_tasks,
        )

    async def ws_chat(self, websocket: WebSocket) -> None:
        await websocket.accept()
        room_id = str(uuid.uuid4())
        await chat_manager.join(room_id, websocket)
        try:
            await websocket.send_json({"type": "connected", "room_id": room_id})
        except Exception:
            await chat_manager.leave(room_id, websocket)
            return

        try:
            while True:
                raw = await websocket.receive_text()
                data = json.loads(raw)
                if data.get("type") != "message":
                    continue
                # Опционально: проверять data.get("room_id") == room_id для повторного подключения в ту же комнату
                history = data.get("history") or []
                text = (data.get("text") or "").strip()
                if not text:
                    await chat_manager.send_to_room(room_id, {"type": "error", "text": "Пустое сообщение."})
                    continue
                history = list(history[-40:]) + [{"role": "user", "content": text}]

                try:
                    service = OpenAIService()
                    stream = service.stream_completion(history)
                except Exception:
                    await chat_manager.send_to_room(room_id, {"type": "error", "text": "Не удалось получить ответ. Попробуйте ещё раз."})
                    continue

                while True:
                    try:
                        kind, payload = await asyncio.to_thread(next, stream)
                    except StopIteration:
                        break
                    except Exception:
                        await chat_manager.send_to_room(room_id, {"type": "error", "text": "Не удалось получить ответ. Попробуйте ещё раз."})
                        break

                    if kind == "chunk":
                        await chat_manager.send_to_room(room_id, {"type": "chunk", "text": payload})
                    elif kind == "done":
                        await chat_manager.send_to_room(room_id, {"type": "done"})
                        break
                    elif kind == "error":
                        await chat_manager.send_to_room(room_id, {"type": "error", "text": payload})
                        break
        except Exception:
            pass
        finally:
            await chat_manager.leave(room_id, websocket)
            try:
                await websocket.close()
            except Exception:
                pass