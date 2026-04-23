import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import FileResponse, Response

from router import ApiRouter


def _check_grpc_on_startup():
    """Пинг gRPC-сервера бота. Без ответа FastAPI не запускается."""
    try:
        webapp_root = Path(__file__).resolve().parent
        if str(webapp_root) not in sys.path:
            sys.path.insert(0, str(webapp_root))
        from grpc_offer.client import ping
        if not ping():
            print("Ошибка: gRPC-сервер бота не ответил на Ping. Запустите бота (bot/bot.py) и повторите.")
            sys.exit(1)
    except Exception as e:
        print(f"Ошибка при проверке gRPC: {e}. Запустите бота (bot/bot.py) и повторите.")
        sys.exit(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    _check_grpc_on_startup()
    yield


app = FastAPI(title="myResume API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://myresume-azora.ru",
        "https://www.myresume-azora.ru",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin"],
)

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
