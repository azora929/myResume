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
      title: "Projects",
      subtitle: "Кейсы из коммерческого опыта в StrokovAI: мой личный вклад в backend, AI-интеграции и production-реализацию.",
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
            <DjsetAnalyticSlide />
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

function DjsetAnalyticSlide() {
  const monitorIcon = usePIcon("monitor");
  const codeIcon = usePIcon("code");
  const boltIcon = usePIcon("bolt");

  return (
    <article className="pSlide" data-accent="mint">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <div className="pSlide__logo pSlide__logo--ghost" aria-hidden>
              <PIcon name="monitor" />
            </div>
            <div>
              <p className="pSlide__kicker">DJSet Analytic</p>
              <span className="pSlide__link">Self-initiated fullstack project</span>
            </div>
          </div>

          <div className="pSlide__tags">
            <span className="tag">FastAPI</span>
            <span className="tag">Celery</span>
            <span className="tag">Redis</span>
            <span className="tag">MongoDB</span>
            <span className="tag">LangGraph</span>
            <span className="tag">WebSocket</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">Реализовал с нуля fullstack-сервис для автоматического анализа длинных DJ-сетов и довел его до рабочего продукта, включая координацию требований и пользовательского сценария.</p>
              </div>
            </div>
            <div className="pMedia">
              <img className="pMedia__img" src="/assets/photos/dj_analytic.png" alt="DJSet Analytic — интерфейс анализа аудиосетов" />
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{codeIcon}</span>
              <div>
                <h3 className="pCard__title">Архитектура и стек</h3>
                <p className="pCard__desc">Самостоятельная реализация end-to-end pipeline</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Спроектировал и реализовал API + worker + UI для конвейерной обработки длинных аудиофайлов</li>
                <li>FastAPI + Uvicorn для API и WebSocket-статусов; Celery + Redis для фоновых задач и очередей</li>
                <li>MongoDB для хранения истории задач и результатов; ffmpeg/ffprobe для сегментации и анализа аудио</li>
                <li>Собрал AI-постобработку на OpenAI Responses API + LangGraph: очистка дублей, нормализация и финальный треклист</li>
                <li>Реализовал экспорт результата в DOCX (python-docx) и личный кабинет с историей запусков</li>
                <li>Выстроил рабочую коммуникацию по требованиям и приоритизации, чтобы быстрее доводить фичи до практического результата</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{boltIcon}</span>
              <div>
                <h3 className="pCard__title">Что сделал и эффект</h3>
                <p className="pCard__desc">Личный вклад в надёжность и реальный продуктовый результат</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Реализовал идемпотентный запуск задач, защиту от дублей и контроль конкурентной нагрузки</li>
                <li>Сделал live-статусы этапов: очередь, сканирование, AI-обработка, завершение/ошибка</li>
                <li>Собрал устойчивую обработку внешних ошибок интеграций без падения всего приложения</li>
                <li>Преобразовал «сырые» распознавания в чистый структурированный треклист с таймингами и годами релизов</li>
                <li>Сократил ручной разбор многочасовых сетов до автоматического прогона с готовым документом</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
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
                <p className="pCard__desc">Мой вклад: разрабатывал backend, AI-логику уроков, realtime-механику, интеграции, монетизацию и пользовательские сценарии.</p>
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
                <p className="pCard__desc">Мой вклад в архитектуру и реализацию</p>
              </div>
            </div>
            <div className="pCard__body">
              <p><b>Роль:</b> Fullstack Developer (Python backend + React frontend)</p>
              <p><b>Стек:</b> Django 5, Channels, WebSocket, WebRTC, PostgreSQL, Redis, Assistants API + Realtime API, React 18, TypeScript, Vite, YooKassa</p>
              <p><b>Фокус моего вклада:</b> устойчивый backend, стриминг‑UX, двухпоточный AI-flow (диалог + фоновая генерация задач), голосовые и экзаменационные сценарии.</p>
              <p>
                Активно взаимодействовал с командой и заказчиком: совместно проектировал ключевые механики и доводил учебные сценарии до production-ready состояния.
              </p>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{boltIcon}</span>
              <div>
                <h3 className="pCard__title">Что сделал и эффект</h3>
                <p className="pCard__desc">Мой вклад и продуктовый эффект</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Реализовал двухпоточный AI-flow: основной ассистент ведет диалог, а генерация задач идет в отдельном фоне</li>
                <li>Сделал генерацию задач незаметной для пользователя и без блокировки чата в момент составления задания</li>
                <li>Интегрировал Assistants API и Realtime API, реализовал tools и lifecycle взаимодействия</li>
                <li>Координировал реализацию с командой frontend/backend для согласованного поведения AI-сценариев и пользовательских потоков</li>
                <li>Улучшил UX продукта за счет переработки backend- и AI-архитектуры</li>
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
                <p className="pCard__desc">Отвечал за backend-логику AI-продукта: роли, стриминг ответов, платежи, подписки, личный кабинет, уроки и тесты.</p>
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
                <p className="pCard__desc">Мой вклад в ключевые продуктовые механики</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Разрабатывал backend-логику продукта: роли пользователей, AI-чат, логику уроков и тестов</li>
                <li>Реализовывал стриминг ответов (SSE), TTS/STT-сценарии и рабочие учебные сценарии внутри платформы</li>
                <li>Участвовал в платежах и подписках: YooKassa/webhooks, баланс и продуктовые ограничения</li>
                <li>Участвовал в обсуждении требований, распределении задач и реализации продуктовых сценариев в команде</li>
                <li>Плотно взаимодействовал с коллегами на этапах проектирования и релизов, синхронизируя backend-изменения с продуктовой логикой</li>
                <li>Интегрировал внешние каналы: SMS (Exolve), Telegram-связку и голосовые сервисы (VoiceKit/SpeechKit)</li>
                <li>Работал над устойчивостью продовых flow с лимитами, пробными доступами и контролем состояний</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{rocketIcon}</span>
              <div>
                <h3 className="pCard__title">Результат</h3>
                <p className="pCard__desc">Мой вклад в стабильность и масштабирование</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Участвовал в развитии коммерческого EdTech-продукта с нагрузкой до ~1000 пользователей одновременно</li>
                <li>Развивал backend и интеграции в связке AI + биллинг + пользовательские сценарии</li>
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
              <p className="pSlide__kicker">Luna</p>
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
                <p className="pCard__desc">Реализовал с нуля коммерческий AI-сервис в формате Telegram-бота и вывел его в прод.</p>
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
                <p className="pCard__desc">Мой вклад в stateful user flow и монетизацию</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Спроектировал архитектуру и реализовал backend всего продукта end-to-end</li>
                <li>Спроектировал backend-архитектуру, поэтапную воронку через статусы, подписку, оплаты, WebApp и планировщики</li>
                <li>Сделал WebApp-магазин, интеграции Telegram Payments и YooKassa, рабочие сценарии монетизации</li>
                <li>Подключил голосовые сценарии (Whisper/TTS) и связал их с продуктовой логикой без разрывов UX</li>
                <li>На всем цикле разработки синхронизировал продуктовые решения с заказчиком: от требований до запуска и доработок</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{sparkIcon}</span>
              <div>
                <h3 className="pCard__title">Стек и отчёты</h3>
                <p className="pCard__desc">Мой вклад в интеграции и инженерную надёжность</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList pList--cols">
                <li>Реализовал AI-слой на Assistants API с кастомными tools и асинхронной сервисной логикой</li>
                <li>Собрал pipeline генерации PDF-отчётов (Jinja2 + Playwright + расчётные модули)</li>
                <li>Довел проект до полностью готового и рабочего состояния</li>
                <li>Реализовал рабочую платежную и подписочную логику с продлениями, возобновлениями и оформлением подписок</li>
                <li>Собрал backend-поток с голосовыми сценариями, очередью покупок и timezone-aware логикой</li>
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
            <span className="tag">OpenAI</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{gridIcon}</span>
              <div>
                <h3 className="pCard__title">Chester Feya CRM</h3>
                <p className="pCard__desc">Мой вклад: построил backend-контур CRM и ИИ-менеджера с доступом к данным, где запросы на естественном языке превращаются в безопасные SQL-выборки и отчёты.</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Разрабатывал backend на FastAPI и строил сервисный контур PostgreSQL → gRPC → REST → React SPA</li>
                <li>Реализовывал модельный слой, API для таблиц и бизнес-логику поиска/пагинации/редактирования</li>
                <li>Участвовал в архитектуре аналитики и пользовательских данных (агрегаты, персональная аналитика, временные ряды)</li>
                <li><strong>ИИ-менеджер (мой вклад):</strong> отдельный AI-микросервис с function calling, SQL generation (только SELECT), read-only валидацией, режимами CRM/R-Keeper и сохранением сессий</li>
                <li>Поддерживал интеграционный каркас: Protocol Buffers, реестр таблиц/моделей и кодогенерацию gRPC-стабов</li>
                <li>Работал в плотной связке с командой по архитектурным решениям и приоритизации доработок под бизнес-задачи</li>
              </ul>
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{docIcon}</span>
              <div>
                <h3 className="pCard__title">НБКИ (Credit Bot)</h3>
                <p className="pCard__desc">Мой вклад: реализовал end-to-end pipeline обработки PDF-отчётов БКИ с валидацией, сводкой в чат и полной JSON-выгрузкой.</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Реализовал Telegram-бота и end-to-end обработку PDF-отчётов БКИ</li>
                <li>Написал большой парсер (~1400 строк) с валидацией структуры и извлечением ключевых разделов отчёта</li>
                <li>Сделал выдачу результата в двух форматах: краткая сводка в чат и полная JSON-выгрузка</li>
                <li>Реализовал асинхронную архитектуру (python-telegram-bot + asyncio), блокировку 1 запрос/пользователь и retry logic</li>
                <li>Покрыл критичные части тестами (pytest)</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{globeIcon}</span>
              <div>
                <h3 className="pCard__title">Сайт-резюме</h3>
                <p className="pCard__desc">Собрал сайт как инженерный продукт end-to-end: от UX и чата до PDF-рендера, интеграций и деплоя.</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Реализовал сайт как инженерный продукт: frontend на React/TypeScript/Vite и backend на FastAPI</li>
                <li>Собрал AI-чат по WebSocket со стримингом OpenAI и лимитами по IP через Redis</li>
                <li>Реализовал сценарий оффера: tool calling в чате → gRPC → Telegram-бот → уведомление в личку</li>
                <li>Сделал PDF-генерацию резюме через Playwright и шаблоны</li>
                <li>Подготовил production-контур: Docker, Kubernetes, домен, TLS, runtime-конфигурация сервисов</li>
                <li>Доработал адаптивность и UX-состояния так, чтобы продукт ощущался цельным</li>
                <li>Согласовывал структуру, тексты и UX с заказчиком на всех этапах, чтобы быстро переводить обратную связь в рабочие релизы</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}
