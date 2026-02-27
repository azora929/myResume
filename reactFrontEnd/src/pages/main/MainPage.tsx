import { Section } from "@/components/section/Section";
import "@/styles/main/main.scss";

export function MainPage() {
  return (
    <main className="main-page">
      <Section id="hero" variant="hero">
        <div className="hero__content">
          <p className="hero__label">Резюме</p>
          <h1 className="hero__title">
            Middle Python Fullstack Developer
            <span className="hero__title-accent"> — AI/LLM Integrations</span>
          </h1>
          <p className="hero__subtitle">
            Backend, API, стриминг, OpenAI и живой UX в продуктах
          </p>
          <a href="#skills" className="hero__cta">
            Смотреть навыки
          </a>
        </div>
      </Section>

      <Section id="skills" variant="skills">
        <div className="content-section">
          <h2 className="content-section__title">Навыки и сильные стороны</h2>
          <div className="content-section__body prose">
            <p>
              Я fullstack‑разработчик с фокусом на Python‑backend и ~2 годами коммерческого опыта в стартапной продуктовой разработке для заказчика: от первых MVP и быстрых итераций до продовых фич, которые выдерживают реальную нагрузку и остаются устойчивыми в долгосрочной перспективе. Моя сильная сторона — строить надёжную серверную часть и доводить пользовательский опыт на фронтенде до «чувства продукта», особенно когда в продукте есть AI/LLM‑функциональность (OpenAI) и важно, чтобы всё работало быстро, стабильно и предсказуемо.
            </p>
            <p>
              С backend‑стороны уверенно проектирую и реализую REST API, продумываю контракты и валидацию, организую интеграции между сервисами, отвечаю за корректную обработку ошибок и устойчивость в нештатных ситуациях. Отдельное внимание уделяю стриминг‑ответам (WebSocket/SSE): умею делать так, чтобы интерфейс получал данные постепенно и сразу показывал ценность, а не «ждал минуту в тишине».
            </p>
            <p>
              С frontend‑стороны участвую в разработке интерфейсов (React/Vite): собираю страницы и компоненты, аккуратно стыкуюсь с API, довожу UX до «живого» ощущения (например, отображение стриминга, состояния загрузки, ошибки, пустые состояния), чтобы пользователь чувствовал качество продукта, а не «набор экранов».
            </p>
            <p className="content-section__list-title">Технический стек и практики:</p>
            <div className="skills-grid">
              <ul>
                <li>Python: асинхронность (async/await), прикладная инженерия под прод</li>
                <li>FastAPI: проектирование и разработка REST API, схемы/валидация, интеграции</li>
                <li>Django: серверная разработка, бизнес‑логика, интеграции с БД</li>
                <li>aiohttp: базово (быстро подключаю при необходимости)</li>
                <li>Стриминг: WebSocket, SSE</li>
                <li>PostgreSQL: миграции, транзакции, индексы, оптимизация запросов, connection pooling</li>
                <li>Redis: кеширование, ускорение горячих операций</li>
                <li>OpenAI (Assistants API): threads/runs, управление контекстом, устойчивые диалоги</li>
                <li>Custom tools для ассистентов: проектирование, реализация и подключение к run</li>
                <li>Надёжность: ретраи, обработка ошибок, логирование, персонализация</li>
              </ul>
              <ul>
                <li>Background jobs / scheduler: периодические задачи, timezone‑aware логика, работа по расписанию</li>
                <li>gRPC, SQLAlchemy, микросервисы</li>
                <li>Playwright: HTML → PDF (генерация документов)</li>
                <li>Frontend: React, Vite, работа с API, UI‑состояния, стриминг‑UX (подключение к WS/SSE)</li>
                <li>Docker: базово (сборка/запуск, docker‑compose)</li>
                <li>Kubernetes: базово (понимание деплоев/сервисов без глубокого администрирования)</li>
                <li>CI/CD: понимание этапов build/test/deploy</li>
                <li>pytest: по необходимости</li>
                <li>Очереди/брокеры (Kafka/RQ): теоретическое понимание (без продового опыта)</li>
              </ul>
            </div>
            <div className="content-section__two-col">
              <div className="content-section__col">
                <p className="content-section__list-title">Образование</p>
                <ul className="content-section__list content-section__list--plain">
                  <li>СПО (колледж): 09.02.07 «Информационные системы и программирование» — красный диплом</li>
                  <li>Высшее образование: в процессе (не IT‑направление)</li>
                </ul>
              </div>
              <div className="content-section__col">
                <p className="content-section__list-title">Языки</p>
                <ul className="content-section__list content-section__list--plain">
                  <li>Русский — родной</li>
                  <li>Английский — B1</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="yespeak" variant="project-teal">
        <div className="project-section">
          <header className="project-section__header">
            <img src="/assets/photos/yespeak_icon.png" alt="" className="project-section__icon" aria-hidden />
            <h2 className="project-section__title">
              <a href="https://yespeak.ru" target="_blank" rel="noopener noreferrer">EvoSpeak / Yespeak</a>
            </h2>
          </header>
          <div className="project-section__media">
            <img src="/assets/photos/yespeak.png" alt="EvoSpeak — платформа обучения языкам" className="project-section__img" />
          </div>
          <div className="project-section__content">
            <p className="project-section__role">Роль: Fullstack Developer (Python backend + React frontend)</p>
            <p className="project-section__stack">Стек: Django, PostgreSQL, OpenAI Assistants API, WebSocket, Redis (точечно), React/Vite</p>
            <p className="project-section__list-title">Что сделал и какой эффект дал:</p>
            <ul className="project-section__list">
              <li>Разработал backend на Django + PostgreSQL и выстроил интеграцию с frontend через аккуратные API‑контракты.</li>
              <li>На фронтенде (React/Vite) участвовал в сборке интерфейса: страницы/компоненты, корректная работа с состояниями и обработкой ошибок, интеграция со стримингом.</li>
              <li>Интегрировал OpenAI Assistants API: управление контекстом, жизненным циклом run, подключение кастомных tools (профили, уроки/тесты, задачи).</li>
              <li>Реализовал стриминг‑ответы LLM через WebSocket, чтобы пользователь получал результат «здесь и сейчас», без ощущения ожидания.</li>
            </ul>
          </div>
          <div className="project-section__content project-section__content--full">
            <ul className="project-section__list">
              <li>Спроектировал механику «двух потоков / двух ассистентов»: основной ассистент ведёт диалог, а второй параллельно генерирует упражнения.</li>
              <li>Организовал генерацию упражнений в виде структурированных JSON‑объектов для удобной и предсказуемой подачи в UI.</li>
              <li>Сократил время ожидания при генерации заданий: вместо ~1 минуты пользователь стал получать первые результаты за считанные секунды благодаря параллельной генерации.</li>
              <li>Внедрил монетизацию: YooKassa (редирект на оплату) + webhooks → серверная обработка событий и управление доступами/статусами в БД.</li>
              <li>Реализовал гибкую модель оплаты: безлимитная подписка + разовая покупка блока уроков.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="iiprepod" variant="project-blue">
        <div className="project-section project-section--reverse">
          <header className="project-section__header">
            <img src="/assets/photos/iiprepod_icon.png" alt="" className="project-section__icon" aria-hidden />
            <h2 className="project-section__title">
              <a href="https://iiprepod.ru" target="_blank" rel="noopener noreferrer">ИИ Препод</a>
            </h2>
          </header>
          <div className="project-section__media">
            <img src="/assets/photos/iiprepod.png" alt="ИИ Препод — образовательная платформа" className="project-section__img" />
          </div>
          <div className="project-section__content">
            <p className="project-section__role">Роль: Fullstack Developer (Python backend + frontend интеграция)</p>
            <p className="project-section__stack">Стек: Django, PostgreSQL, OpenAI API, SSE, YooKassa, интеграция курса ЦБ РФ, (frontend: React/Vite)</p>
            <p className="project-section__list-title">Что сделал и какой эффект дал:</p>
            <ul className="project-section__list">
              <li>Построил backend на Django + PostgreSQL, развивал продуктовые AI‑фичи и обеспечивал стабильную работу под пиковыми нагрузками.</li>
              <li>Подключался к фронтенду: интеграция AI‑инструментов в UI, отображение стриминга, корректные пользовательские состояния (loading/error/empty).</li>
              <li>Интегрировал OpenAI API и реализовал стриминг‑ответы через SSE, чтобы пользователь видел «поток» ответа в реальном времени.</li>
              <li>Разработал динамический биллинг по токенам:
                <ul>
                  <li>учёт токенов и расчёт стоимости ответа on‑the‑fly</li>
                  <li>получение валютного курса через API ЦБ РФ, конвертация USD→RUB и применение наценки</li>
                  <li>списание с баланса пользователя + лимитированный овердрафт (например, до ~100 ₽) и ограничение доступа при превышении лимита</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="project-section__content project-section__content--full">
            <div className="project-section__split">
              <div className="project-section__split-col">
                <ul className="project-section__list">
                  <li>Настроил монетизацию через YooKassa + webhooks: пополнение баланса, обработка событий платежей, управление статусами/доступами в БД.</li>
                  <li>Поддержал понятную экономику продукта: средняя стоимость урока ~300–400 ₽.</li>
                  <li>Продукт достигал пиковой активности до ~1000 пользователей.</li>
                  <li>Проект получил освещение в тех‑СМИ (CNews, Hi‑Tech Mail.ru, 3DNews).</li>
                </ul>
              </div>
              <div className="project-section__split-col">
                <p className="project-section__list-title">Публикации в СМИ:</p>
                <ul className="project-section__links">
                  <li><a href="https://www.cnews.ru/news/line/2025-01-28_v_rossii_zapustili_innovatsionnuyu" target="_blank" rel="noopener noreferrer">CNews</a></li>
                  <li><a href="https://hi-tech.mail.ru/news/122609-v-rossii-sozdali-iskusstvennyj-intellekt-s-myshleniem-rebenka/" target="_blank" rel="noopener noreferrer">Hi-Tech Mail.ru</a></li>
                  <li><a href="https://3dnews.ru/1118243/v-rossii-sozdali-perviy-ii-s-mishleniem-rebyonka" target="_blank" rel="noopener noreferrer">3DNews</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="luna" variant="project-dark">
        <div className="project-section">
          <header className="project-section__header project-section__header--no-icon">
            <h2 className="project-section__title">
              <a href="https://t.me/Luna_knowbot" target="_blank" rel="noopener noreferrer">Луна Знает</a>
            </h2>
          </header>
          <div className="project-section__media">
            <img src="/assets/photos/luna.png" alt="Луна Знает — Telegram-бот" className="project-section__img" />
          </div>
          <div className="project-section__content">
            <p className="project-section__role">Роль: Fullstack Developer (backend + интерфейсы/витрины)</p>
            <p className="project-section__stack">Стек: async/await, OpenAI Assistants API, FastAPI, Redis, Playwright, YooKassa, Telegram invoices</p>
            <p className="project-section__list-title">Что сделал и какой эффект дал:</p>
            <ul className="project-section__list">
              <li>Реализовал полностью асинхронную архитектуру на Python (async/await), ориентированную на быстрые ответы и масштабирование.</li>
              <li>Подключил OpenAI Assistants API и кастомные tools (генерация PDF, создание профилей, завершение уроков/тестов, создание задач).</li>
              <li>Организовал генерацию PDF‑документов через Playwright (рендер HTML → PDF) для красивых, «готовых к отправке» материалов.</li>
              <li>Настроил оплату: YooKassa + Telegram invoices, связал оплату и доступы на стороне сервера.</li>
              <li>Продумал пользовательские сценарии в Telegram: тексты, клавиатуры/кнопки, состояния ошибок и повторов — чтобы бот ощущался как цельный продукт.</li>
              <li>Использовал Redis для кеширования и ускорения горячих операций.</li>
              <li>Реализовал подписку с расписанием: пользователь задаёт интервал и таймзону, а периодическая задача (каждые ~30 минут) проверяет активные подписки в БД и отправляет «расклад на день» в нужное окно времени (логика с учётом таймзон).</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="crm-nbki" variant="project-purple">
        <div className="content-section content-section--two-col">
          <div id="crm" className="content-section__col">
            <h2 className="content-section__title">CRM / панель статистики для Telegram‑бота ресторана</h2>
            <p className="content-section__role">Роль: Fullstack Developer</p>
            <p className="content-section__stack">Стек: FastAPI, PostgreSQL, SQLAlchemy, gRPC, React/Vite</p>
            <p className="content-section__list-title">Что сделал:</p>
            <ul className="content-section__list">
              <li>Разработал CRM со статистикой на основе данных PostgreSQL: помогал бизнесу видеть цифры и принимать решения на фактах.</li>
              <li>На backend построил архитектуру из нескольких сервисов: FastAPI‑сервис и отдельный сервис управления БД на SQLAlchemy.</li>
              <li>Настроил взаимодействие сервисов по gRPC (client/server) для предсказуемого и быстрого обмена данными.</li>
              <li>На frontend (React/Vite) реализовал интерфейс панели: страницы/виджеты, работа с фильтрами/таблицами, интеграция с API и корректные UI‑состояния.</li>
            </ul>
          </div>
          <div id="nbki" className="content-section__col">
            <h2 className="content-section__title">Парсинг отчётов НБКИ (PDF → JSON + сводка)</h2>
            <p className="content-section__role">Роль: Fullstack Developer (бот + серверная логика + выдача результата)</p>
            <p className="content-section__stack">Стек: Telegram‑бот, парсинг PDF, регулярные выражения, преобразование данных</p>
            <p className="content-section__list-title">Что сделал:</p>
            <ul className="content-section__list">
              <li>Реализовал Telegram‑бота: приём PDF → извлечение текста → преобразование отчёта в структурированный JSON.</li>
              <li>Написал парсер таблиц и секций отчёта, использовал регулярные выражения и аккуратную обработку крайних случаев.</li>
              <li>Формировал краткую, понятную текстовую сводку для клиента, чтобы итог был не только «данные», но и быстрое понимание результата.</li>
              <li>Продумал формат выдачи результата пользователю (сообщения/структура), чтобы это было удобно читать и использовать.</li>
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
