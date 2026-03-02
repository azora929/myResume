from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

from services.pdf_handler import PdfRenderHandler


class ApiRouter:
    def __init__(self) -> None:
        self.router = APIRouter(prefix="/api", tags=["api"])
        self.router.get("/pdf")(self.generate_pdf)

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