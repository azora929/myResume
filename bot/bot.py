#!/usr/bin/env python3
"""
Личный бот: команда /start (чтобы бот мог писать пользователю), простой хендлер —
ответ «это личный бот». В том же процессе запускается gRPC-сервер для приёма офферов с сайта-резюме.
"""
from __future__ import annotations

import asyncio
import logging
import os
import threading
from concurrent.futures import ThreadPoolExecutor

import grpc
from dotenv import load_dotenv
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

from proto import offer_pb2_grpc, offer_pb2

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper(), logging.INFO),
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("OFFER_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
GRPC_PORT = int(os.getenv("GRPC_PORT", "50051"))


def format_offer_message(request) -> str:
    lines = [
        "📩 Новый оффер с сайта-резюме",
        "",
        f"💰 Вилка: {request.salary_range or '—'}",
        f"📞 Контакты: {request.contacts or '—'}",
        f"🏢 Компания: {request.company or '—'}",
    ]
    if request.comment and request.comment.strip():
        lines.append("")
        lines.append(f"💬 Комментарий: {request.comment.strip()}")
    return "\n".join(lines)


# --- gRPC servicer ---
class OfferNotifyServicer(offer_pb2_grpc.OfferNotifyServicer):
    def __init__(self, bot: Bot):
        self._bot = bot

    def Ping(self, request, context):
        return offer_pb2.PingResponse(ok=True)

    def NotifyOffer(self, request, context):
        text = format_offer_message(request)
        try:
            asyncio.run(self._bot.send_message(chat_id=TELEGRAM_CHAT_ID, text=text))
            return offer_pb2.OfferResponse(success=True, message="Отправлено")
        except Exception as e:
            logger.exception("NotifyOffer send_message: %s", e)
            return offer_pb2.OfferResponse(success=False, message="Не удалось отправить в Telegram")


def run_grpc_server(bot: Bot):
    server = grpc.server(ThreadPoolExecutor(max_workers=4))
    offer_pb2_grpc.add_OfferNotifyServicer_to_server(OfferNotifyServicer(bot), server)
    server.add_insecure_port(f"[::]:{GRPC_PORT}")
    server.start()
    logger.info("gRPC server listening on port %s", GRPC_PORT)
    server.wait_for_termination()


# --- Telegram: команда /start и хендлер сообщений ---
async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    await update.message.reply_text(
        "Привет. Это личный бот — сюда приходят уведомления об офферах с сайта-резюме. "
        "Писать могу только я тебе, диалога нет."
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    await update.message.reply_text("Это личный бот: только уведомления, без диалога.")


def main():
    if not BOT_TOKEN:
        raise RuntimeError("Задайте OFFER_BOT_TOKEN или LUNA_TG_TOKEN в .env")

    bot = Bot(token=BOT_TOKEN)

    # gRPC сервер в фоновом потоке (передаём bot для send_message)
    grpc_thread = threading.Thread(target=run_grpc_server, args=(bot,), daemon=True)
    grpc_thread.start()

    # Telegram бот (тот же экземпляр)
    app = (
        Application.builder()
        .bot(bot)
        .build()
    )
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(MessageHandler(filters.ALL, handle_message))

    logger.info("Bot + gRPC server started (gRPC port %s)", GRPC_PORT)
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
