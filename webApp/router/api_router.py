from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from services.openai_service import OpenAIService
from services.pdf_handler import PdfRenderHandler


class ApiRouter:
    def __init__(self) -> None:
        self.router = APIRouter(prefix="/api", tags=["api"])
        self.router.get("/pdf")(self.generate_pdf)
        self.router.post("/chat")(self.chat)

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

    class ChatTurn(BaseModel):
        role: str = Field(..., pattern="^(user|assistant)$")
        content: str = Field(..., min_length=1, max_length=4000)

    class ChatRequest(BaseModel):
        history: list["ApiRouter.ChatTurn"] = Field(..., max_items=40)

    class ChatResponse(BaseModel):
        reply: str

    def chat(self, payload: "ApiRouter.ChatRequest") -> "ApiRouter.ChatResponse":
        try:
            service = OpenAIService()
            history_dicts = [turn.model_dump() for turn in payload.history]
            reply = service.get_completion(history_dicts)
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=500, detail="Не удалось получить ответ. Попробуйте ещё раз.")

        return ApiRouter.ChatResponse(reply=reply)