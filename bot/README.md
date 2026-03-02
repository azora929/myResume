# Бот + gRPC для офферов с сайта-резюме

Запуск: из папки `bot` — `python3 bot.py`. В .env: `OFFER_BOT_TOKEN` или `LUNA_TG_TOKEN`.

- **/start** — бот отвечает, что это личный бот, сюда приходят уведомления об офферах.
- Остальные сообщения — ответ: «Это личный бот: только уведомления, без диалога».
- **gRPC** на порту 50051: `Ping`, `NotifyOffer` (шлёт оффер в Telegram, chat_id 556644188).

FastAPI при старте делает Ping по gRPC; без ответа не запускается.

## Перегенерация proto (из папки bot)

```bash
python3 -m grpc_tools.protoc -I proto proto/offer.proto --python_out=proto --grpc_python_out=proto
```

Итог: `proto/offer_pb2.py`, `proto/offer_pb2_grpc.py` (без вложенного proto).
