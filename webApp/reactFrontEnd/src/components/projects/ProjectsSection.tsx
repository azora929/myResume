import { useMemo, useRef } from "react";
import { PIcon } from "@/components/icons/PIcon";
import { usePIcon } from "@/hooks/usePIcon/usePIcon";
import { useProjectsScroller } from "@/hooks/useProjectsScroller/useProjectsScroller";
import { Section } from "@/components/section/Section";
import "./ProjectsSection.scss";

export function ProjectsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useProjectsScroller({ trackRef });

  const titleMeta = useMemo(
    () => ({
      title: "Проекты",
      subtitle: "Проекты, где я отвечал за backend, интеграции OpenAI и “живой” UX со стримингом.",
    }),
    []
  );

  return (
    <Section id="projects" variant="projects">
      <div className="projectsPro" id="projectsPro">
        <header className="projectsPro__header">
          <p className="projectsPro__kicker">
            <span className="dot" aria-hidden="true"></span>
            Projects
          </p>
          <h2 className="projectsPro__title">{titleMeta.title}</h2>
          <p className="projectsPro__subtitle">{titleMeta.subtitle}</p>
        </header>

        <div className="projectsPro__stage" id="projectsStage" ref={stageRef}>
          <div className="projectsPro__track" id="projectsTrack" ref={trackRef}>
            <YespeakSlide />
            <IiprepodSlide />
            <LunaSlide />
            <CrmNbkiSlide />
          </div>
          <button className="projectsPro__nav projectsPro__nav--prev" type="button" aria-label="Предыдущий слайд">
            <span className="projectsPro__arrow" aria-hidden="true">‹</span>
          </button>
          <button className="projectsPro__nav projectsPro__nav--next" type="button" aria-label="Следующий слайд">
            <span className="projectsPro__arrow" aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </Section>
  );
}

function YespeakSlide() {
  const monitorIcon = usePIcon("monitor");
  const idIcon = usePIcon("id");
  const boltIcon = usePIcon("bolt");

  return (
    <article className="pSlide" data-accent="cyan">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <img src="/assets/photos/yespeak_icon.png" alt="" aria-hidden className="pSlide__logo" />
            <div>
              <p className="pSlide__kicker">EvoSpeak / Yespeak</p>
              <a className="pSlide__link" href="https://yespeak.ru" target="_blank" rel="noopener noreferrer">
                yespeak.ru
              </a>
            </div>
          </div>

          <div className="pSlide__tags">
            <span className="tag">Fullstack</span>
            <span className="tag">Django</span>
            <span className="tag">React/Vite</span>
            <span className="tag">OpenAI</span>
            <span className="tag">WebSocket</span>
            <span className="tag">Realtime API</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">Платформа изучения языка с AI: чат, тест уровня, уроки, экзамены</p>
              </div>
            </div>
            <div className="pMedia">
              <img className="pMedia__img" src="/assets/photos/yespeak.png" alt="EvoSpeak — платформа обучения языкам" />
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{idIcon}</span>
              <div>
                <h3 className="pCard__title">Роль и стек</h3>
                <p className="pCard__desc">Коротко и по делу</p>
              </div>
            </div>
            <div className="pCard__body">
              <p><b>Роль:</b> Fullstack Developer (Python backend + React frontend)</p>
              <p><b>Стек:</b> Django 5, Channels, WebSocket, PostgreSQL, Redis, Assistants API + Realtime API, React 18, TypeScript, Vite, Three.js, MobX</p>
              <p><b>Фокус:</b> устойчивый backend, стриминг‑UX, два потока (диалог + фоновая генерация заданий), голос (TTS, Realtime).</p>
              <p>
                Чат-уроки, тест уровня, разговорные уроки и экзамен говорения (Realtime API), экзамены по этапам; 3D-аватар с липсинком; монетизация ЮKassa.
              </p>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{boltIcon}</span>
              <div>
                <h3 className="pCard__title">Что сделал и эффект</h3>
                <p className="pCard__desc">Фичи, которые видно</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Два потока: стриминг диалога по WebSocket + фоновая генерация заданий в отдельном OpenAI thread (tools)</li>
                <li>OpenAI Assistants API: контекст, lifecycle, кастомные tools (request_task_generation, check_task_status и др.)</li>
                <li>Realtime API: разговорные уроки и экзамен говорения через прокси (голос в реальном времени)</li>
                <li>3D-аватар (Three.js) с липсинком под озвучку сообщений</li>
                <li>TTS по HTTP, озвучка по частям с кешем; голосовой ввод (транскрипция), анализ произношения</li>
                <li>Тест уровня языка (WebSocket), экзамены по этапам (грамматика, чтение, аудирование, письмо, говорение)</li>
                <li>ЮKassa: пополнение баланса, безлимит, проверка доступа к уроку, покупка с баланса</li>
                <li>Django Channels, Redis (channel layers), светлая/тёмная тема, code-splitting (Vite)</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}

function IiprepodSlide() {
  const monitorIcon = usePIcon("monitor");
  const brainIcon = usePIcon("brain");
  const rocketIcon = usePIcon("rocket");

  return (
    <article className="pSlide" data-accent="blue">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <img src="/assets/photos/iiprepod_icon.png" alt="" aria-hidden className="pSlide__logo" />
            <div>
              <p className="pSlide__kicker">ИИ Препод</p>
              <a className="pSlide__link" href="https://iiprepod.ru" target="_blank" rel="noopener noreferrer">
                iiprepod.ru
              </a>
            </div>
          </div>

          <div className="pSlide__tags">
            <span className="tag">Django</span>
            <span className="tag">DRF</span>
            <span className="tag">SSE</span>
            <span className="tag">Billing</span>
            <span className="tag">YooKassa</span>
            <span className="tag">OpenAI</span>
            <span className="tag">Telegram</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">EdTech для школьников: AI-тьютор, роли, сессии, чат, оплата</p>
              </div>
            </div>
            <div className="pMedia">
              <img className="pMedia__img" src="/assets/photos/iiprepod.png" alt="ИИ Препод — образовательная платформа" />
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{brainIcon}</span>
              <div>
                <h3 className="pCard__title">Ключевые штуки</h3>
                <p className="pCard__desc">AI, роли, платежи, SMS и Telegram</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Роли: ученик, родитель, учитель, партнёр; кастомная модель пользователя</li>
                <li>Сессии по предметам/классам, чат с GPT, стриминг ответов (SSE), онлайн-уроки, подготовка к ОГЭ, психотесты с GPT</li>
                <li>Токен-биллинг USD→RUB (курс ЦБ, tiktoken), баланс + овердрафт, YooKassa + webhooks</li>
                <li>Авторизация: SMS (Exolve), Telegram-бот (привязка по коду из ЛК, уведомления, альтернативный вход)</li>
                <li>TTS: Tinkoff VoiceKit (gRPC), Yandex SpeechKit; пробные уроки с лимитом по IP, ЛК родителя, награды и баллы</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{rocketIcon}</span>
              <div>
                <h3 className="pCard__title">Результат</h3>
                <p className="pCard__desc">Стабильность и рост</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Django 5, DRF, Daphne (ASGI), Channels, PostgreSQL; пики до ~1000 пользователей</li>
                <li>OpenAI API (GPT), tiktoken, стриминг SSE; YooKassa, вебхуки, баланс</li>
                <li>Exolve (SMS), Telegram-бот (привязка/уведомления/альт-авторизация), TTS (VoiceKit gRPC, SpeechKit)</li>
                <li>~300–400 ₽ за урок; публикации:{" "}
                  <a href="https://www.cnews.ru/news/line/2025-01-28_v_rossii_zapustili_innovatsionnuyu" target="_blank" rel="noopener noreferrer">CNews</a>,{" "}
                  <a href="https://hi-tech.mail.ru/news/122609-v-rossii-sozdali-iskusstvennyj-intellekt-s-myshleniem-rebenka/" target="_blank" rel="noopener noreferrer">Hi‑Tech Mail.ru</a>,{" "}
                  <a href="https://3dnews.ru/1118243/v-rossii-sozdali-perviy-ii-s-mishleniem-rebyonka" target="_blank" rel="noopener noreferrer">3DNews</a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}

function LunaSlide() {
  const monitorIcon = usePIcon("monitor");
  const codeIcon = usePIcon("code");
  const sparkIcon = usePIcon("spark");

  return (
    <article className="pSlide" data-accent="dark">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <div className="pSlide__logo pSlide__logo--ghost" aria-hidden>
              <PIcon name="moon" />
            </div>
            <div>
              <p className="pSlide__kicker">Луна Знает</p>
              <a className="pSlide__link" href="https://t.me/Luna_knowbot" target="_blank" rel="noopener noreferrer">
                t.me/Luna_knowbot
              </a>
            </div>
          </div>

          <div className="pSlide__tags">
            <span className="tag">FastAPI</span>
            <span className="tag">Assistants API</span>
            <span className="tag">Redis</span>
            <span className="tag">Playwright</span>
            <span className="tag">WebApp</span>
            <span className="tag">Payments</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">Астрологический AI-помощник «Луна»: портрет, отчёты, подписка</p>
              </div>
            </div>
            <div className="pMedia">
              <img className="pMedia__img" src="/assets/photos/luna.png" alt="Luna — астрологический бот в Telegram" />
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{codeIcon}</span>
              <div>
                <h3 className="pCard__title">Механики</h3>
                <p className="pCard__desc">Этапы, подписка, магазин</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Поэтапный сценарий: introduction → бесплатный портрет (PDF) → продажа подписки/магазин отчётов</li>
                <li>Динамические tools и промпты по этапу; миграция истории диалога; кэш контекста в Redis</li>
                <li>Подписка: ежедневные расклады и вечерние вопросы по таймзоне пользователя; истечение и продление</li>
                <li>Магазин в WebApp (HTTPS: ngrok в dev, свой домен в prod); очередь покупок, атомарное сохранение отчётов</li>
                <li>Голос: Whisper (транскрипция), TTS ответов; Telegram Payments, ЮKassa</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{sparkIcon}</span>
              <div>
                <h3 className="pCard__title">Стек и отчёты</h3>
                <p className="pCard__desc">Assistants API, PDF, платёжки</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Assistants API, кастомные tools; async FastAPI, Redis</li>
                <li>PDF-отчёты: Jinja2, Playwright; натальные/ведические карты (Kerykeion, AstroKundali, Matplotlib)</li>
                <li>Платные отчёты: синастрия, натал, прогнозы, выбор даты, карьера/деньги, карта ребёнка</li>
                <li>Стоимость диалога (токены → USD → RUB по курсу ЦБ); планировщик с привязкой к таймзоне</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}

function CrmNbkiSlide() {
  const gridIcon = usePIcon("grid");
  const docIcon = usePIcon("doc");
  const globeIcon = usePIcon("globe");

  return (
    <article className="pSlide pSlide--two" data-accent="violet">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <div className="pSlide__logo pSlide__logo--ghost" aria-hidden>
              <PIcon name="grid" />
            </div>
            <div>
              <p className="pSlide__kicker">Chester Feya CRM + НБКИ</p>
              <a className="pSlide__link" href="https://t.me/iiChesterField" target="_blank" rel="noopener noreferrer">t.me/iiChesterField</a>
            </div>
          </div>

          <div className="pSlide__tags">
            <span className="tag">FastAPI</span>
            <span className="tag">PostgreSQL</span>
            <span className="tag">gRPC</span>
            <span className="tag">React/Vite</span>
            <span className="tag">PDF→JSON</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{gridIcon}</span>
              <div>
                <h3 className="pCard__title">Chester Feya CRM</h3>
                <p className="pCard__desc">Инфраструктура для бота ресторана: привлечение гостей, рассылки, меню, брони, промокоды. Веб-панель: таблицы, переписка, аналитика</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Бот: зазывает гостей, рассылки, меню, бронирование, промокоды</li>
                <li>PostgreSQL → gRPC databaseManager (SQLAlchemy) → FastAPI REST + React SPA; проверка gRPC при старте</li>
                <li>Таблицы: пагинация, поиск по полям и ID, редактирование строк</li>
                <li>Переписка с пользователями, аналитика: агрегаты и персональная по пользователю, временные ряды, графики (Recharts)</li>
                <li>Protocol Buffers, реестр таблиц и моделей, кодогенерация стабов</li>
              </ul>
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{docIcon}</span>
              <div>
                <h3 className="pCard__title">НБКИ (Credit Bot)</h3>
                <p className="pCard__desc">Обработка кредитных отчётов БКИ из PDF: сводка в чат + JSON</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Telegram-бот: приём PDF отчёта, только PDF (проверка MIME)</li>
                <li>Парсинг: скоринг, договоры, просрочки, заявки; валидация структуры</li>
                <li>Краткая сводка в чат и полная выгрузка в JSON-файл</li>
                <li>Async (python-telegram-bot, asyncio), блокировка по пользователю, ретраи при отправке</li>
                <li>Парсер ~1400 строк, PyPDF2, pytest</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{globeIcon}</span>
              <div>
                <h3 className="pCard__title">Сайт-резюме</h3>
                <p className="pCard__desc">На чём построен этот сайт</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Frontend: React 18, TypeScript, Vite 6, React Router, SASS</li>
                <li>Backend: FastAPI, Uvicorn; раздача статики из сборки React</li>
                <li>PDF-резюме: Playwright (Chromium), выбор шаблона из нескольких HTML</li>
                <li>Чат с AI: WebSocket, стриминг ответов OpenAI; лимит сообщений по IP (Redis)</li>
                <li>Офферы из чата: tool calling → gRPC в Telegram-бота, уведомление мне</li>
                <li>Адаптивная вёрстка, доступность</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}
