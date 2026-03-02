"""
gRPC-клиент для отправки оффера на сервер бота.
Адрес сервера: OFFER_GRPC_HOST:OFFER_GRPC_PORT (по умолчанию localhost:50051).
"""
from __future__ import annotations

import os

import grpc
from grpc_offer.proto import offer_pb2, offer_pb2_grpc


def _target() -> str:
    host = os.getenv("OFFER_GRPC_HOST", "localhost")
    port = os.getenv("OFFER_GRPC_PORT", "50051")
    return f"{host}:{port}"


def ping() -> bool:
    """Пинг gRPC-сервера бота. Возвращает True, если ответ получен."""
    try:
        with grpc.insecure_channel(_target(), options=[("grpc.keepalive_timeout_ms", 5000)]) as channel:
            stub = offer_pb2_grpc.OfferNotifyStub(channel)
            response = stub.Ping(offer_pb2.PingRequest(), timeout=5.0)
            return response.ok
    except Exception:
        return False


def notify_offer(salary_range: str, contacts: str, company: str, comment: str = "") -> tuple[bool, str]:
    """
    Отправляет оффер на gRPC-сервер бота. Возвращает (success, message).
    """
    request = offer_pb2.OfferRequest(
        salary_range=salary_range or "",
        contacts=contacts or "",
        company=company or "",
        comment=comment or "",
    )
    try:
        with grpc.insecure_channel(_target(), options=[("grpc.keepalive_timeout_ms", 5000)]) as channel:
            stub = offer_pb2_grpc.OfferNotifyStub(channel)
            response = stub.NotifyOffer(request, timeout=10.0)
            return response.success, response.message or ""
    except Exception as e:
        return False, str(e)
