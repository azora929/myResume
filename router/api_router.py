from fastapi import APIRouter


class ApiRouter:
    def __init__(self) -> None:
        self.router = APIRouter(prefix="/api", tags=["api"])