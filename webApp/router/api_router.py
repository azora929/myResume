from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from starlette.websockets import WebSocket

from services.chat_connection_manager import ChatConnectionManager
from services.pdf_handler import PdfRenderHandler


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
        await chat_manager.handle_connection(websocket)