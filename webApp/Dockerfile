# --- Stage 1: Frontend build ---
FROM node:20-alpine AS frontend
WORKDIR /app/reactFrontEnd

COPY reactFrontEnd/package.json reactFrontEnd/package-lock.json ./
RUN npm ci
COPY reactFrontEnd/ ./
RUN npm run build

# --- Stage 2: Backend + static + Playwright ---
FROM python:3.11-slim-bookworm AS backend

# Системные зависимости для Playwright Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libasound2 libpango-1.0-0 libcairo2 \
    fonts-liberation fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install chromium

COPY main.py ./
COPY router/ ./router/
COPY services/ ./services/
COPY grpc_offer/ ./grpc_offer/
COPY assets/ ./assets/
COPY --from=frontend /app/reactFrontEnd/dist ./reactFrontEnd/dist

ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
