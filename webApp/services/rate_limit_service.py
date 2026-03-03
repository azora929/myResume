"""
Лимит сообщений в чате по IP: Redis, ключ = IP, значение = счётчик, TTL = 24ч.
При первом сообщении создаётся ключ с TTL, при последующих только INCR (TTL не обновляется).
"""
from __future__ import annotations

import logging
import os
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from redis.asyncio import Redis

logger = logging.getLogger(__name__)

DAILY_LIMIT = 40
TTL_SECONDS = 86400  # 24 часа
KEY_PREFIX = "chat:daily:"

_redis_client: Optional["Redis"] = None


def _get_redis():
    """Ленивое подключение к Redis (один клиент на приложение)."""
    global _redis_client
    if _redis_client is None:
        try:
            from redis.asyncio import Redis
            url = os.getenv("REDIS_URL")
            if not url:
                host = os.getenv("REDIS_HOST", "localhost")
                port = os.getenv("REDIS_PORT", "6379")
                url = f"redis://{host}:{port}"
            _redis_client = Redis.from_url(url, decode_responses=True)
        except Exception as e:
            logger.warning("Redis rate_limit_service: %s", e)
    return _redis_client


async def check_and_incr(ip: str) -> bool:
    """
    Увеличивает счётчик сообщений по IP. При первом сообщении создаёт ключ с TTL 24ч.
    Возвращает True, если сообщение разрешено (в пределах лимита), False если лимит исчерпан.
    При ошибке Redis возвращает True (fail open), логирует предупреждение.
    """
    r = _get_redis()
    if r is None:
        return True
    key = f"{KEY_PREFIX}{ip}"
    try:
        count = await r.incr(key)
        if count == 1:
            await r.expire(key, TTL_SECONDS)
        if count > DAILY_LIMIT:
            await r.decr(key)
            return False
        return True
    except Exception as e:
        logger.warning("Redis check_and_incr for %s: %s", ip, e)
        return True
