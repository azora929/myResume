FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY bot.py ./
COPY proto/ ./proto/

ENV GRPC_PORT=50051
EXPOSE 50051

CMD ["python", "-u", "bot.py"]
