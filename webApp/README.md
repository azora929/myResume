# Инструкция по запуску проекта

Проект состоит из:
- **Backend** на FastAPI (`main.py`)
- **Frontend** на React + Vite (`reactFrontEnd/`)
- **Генерации PDF** через Playwright (Chromium)

## Требования
- Python 3.10+
- Node.js 18+

## Установка и запуск (Backend)
1. Создать и активировать виртуальное окружение:
   - macOS / Linux:
     ```
     python3 -m venv .venv
     source .venv/bin/activate
     ```
   - Windows (PowerShell):
     ```
     python -m venv .venv
     .venv\\Scripts\\Activate.ps1
     ```
2. Установить зависимости:
   ```
   pip install -r requirements.txt
   ```
3. Установить браузер Playwright (Chromium):
   ```
   playwright install chromium
   ```
4. Запустить backend:
   ```
   python main.py
   ```
   Сервер поднимется на `http://localhost:8000`.

## Установка (Frontend)
1. Перейти в папку фронта:
   ```
   cd reactFrontEnd
   ```
2. Установить зависимости:
   ```
   npm install
   ```

## Сборка фронта и запуск
1. Собрать фронт:
   ```
   npm run build
   ```
2. Запустить backend (`python main.py`).
   FastAPI будет раздавать статическую сборку из `reactFrontEnd/dist`.

## Dev‑режим (опционально)
Если нужно отдельно запускать фронт для разработки:
```
cd reactFrontEnd
npm run dev
```

## Генерация PDF
- Кнопка «Выгрузить в PDF резюме» вызывает эндпоинт:
  ```
  GET /api/pdf
  ```
- Шаблон выбирается случайно из `assets/templates`.
- Временные файлы автоматически удаляются после отдачи.
