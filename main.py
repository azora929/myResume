from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import FileResponse, Response

from router import ApiRouter

app = FastAPI(title="myResume API")
app.include_router(ApiRouter().router)

# Корень проекта и папка со сборкой фронта
FRONTEND_DIST = Path(__file__).resolve().parent / "reactFrontEnd" / "dist"


class SPAFallbackMiddleware(BaseHTTPMiddleware):
    """Для SPA: при 404 на GET (кроме /api) отдаём index.html."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        if (
            response.status_code == 404
            and request.method == "GET"
            and not request.url.path.startswith("/api")
        ):
            index_path = FRONTEND_DIST / "index.html"
            if index_path.exists():
                return FileResponse(index_path)
        return response


if FRONTEND_DIST.exists():
    app.add_middleware(SPAFallbackMiddleware)
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
