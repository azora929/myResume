import { useMemo, useRef } from "react";
import { PIcon } from "@/components/icons/PIcon";
import { usePIcon } from "@/hooks/usePIcon/usePIcon";
import { useProjectsScroller } from "@/hooks/useProjectsScroller/useProjectsScroller";
import { Section } from "@/components/section/Section";

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
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">Скрин + ключевой UX</p>
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
              <p><b>Стек:</b> Django, PostgreSQL, OpenAI Assistants API, WebSocket, Redis (точечно), React/Vite</p>
              <p><b>Фокус:</b> устойчивый backend, стриминг‑UX и предсказуемые API‑контракты.</p>
              <p>
                Делал так, чтобы продукт ощущался «живым»: быстрый ответ, понятные состояния и аккуратная логика,
                которая держит нагрузку и не ломается в крайних случаях.
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
                <li>Backend Django + PostgreSQL, интеграция через аккуратные API‑контракты.</li>
                <li>React/Vite: страницы/компоненты, состояния, ошибки, интеграция со стримингом.</li>
                <li>OpenAI Assistants API: управление контекстом, lifecycle run, кастомные tools.</li>
                <li>Стриминг LLM через WebSocket — результат «здесь и сейчас».</li>
                <li>Механика «двух потоков»: диалог + параллельная генерация упражнений.</li>
                <li>Монетизация: YooKassa + webhooks, управление доступами/статусами.</li>
                <li>Структурированные JSON‑объекты упражнений для предсказуемой подачи в UI.</li>
                <li>Сокращение ожидания генерации: первые результаты за секунды, не минуты.</li>
                <li>Гибкая модель оплаты: подписка + разовая покупка блока уроков.</li>
                <li>Фокус на удержании: понятный прогресс, быстрые ответы и уверенный UX.</li>
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
            <span className="tag">SSE</span>
            <span className="tag">Billing</span>
            <span className="tag">YooKassa</span>
            <span className="tag">OpenAI</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Продукт</h3>
                <p className="pCard__desc">Скрин</p>
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
                <p className="pCard__desc">AI + экономика</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Стриминг ответов через SSE</li>
                <li>Динамический биллинг по токенам (USD→RUB + наценка)</li>
                <li>Баланс + лимитированный овердрафт</li>
                <li>YooKassa + webhooks</li>
                <li>Стабильность под пиковыми нагрузками</li>
                <li>Интеграция курса ЦБ РФ для корректных расчётов</li>
                <li>Корректные UX‑состояния в интерфейсе (loading/error/empty)</li>
                <li>Прозрачная экономика и понятная ценность урока для пользователя</li>
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
                <li>Backend на Django + PostgreSQL под пиковые нагрузки</li>
                <li>UX: streaming + корректные состояния</li>
                <li>Средняя стоимость урока ~300–400 ₽</li>
                <li>Пики до ~1000 пользователей</li>
                <li>
                  Публикации:{" "}
                  <a href="https://www.cnews.ru/news/line/2025-01-28_v_rossii_zapustili_innovatsionnuyu" target="_blank" rel="noopener noreferrer">
                    CNews
                  </a>
                  ,{" "}
                  <a href="https://hi-tech.mail.ru/news/122609-v-rossii-sozdali-iskusstvennyj-intellekt-s-myshleniem-rebenka/" target="_blank" rel="noopener noreferrer">
                    Hi‑Tech Mail.ru
                  </a>
                  ,{" "}
                  <a href="https://3dnews.ru/1118243/v-rossii-sozdali-perviy-ii-s-mishleniem-rebyonka" target="_blank" rel="noopener noreferrer">
                    3DNews
                  </a>
                </li>
                <li>Управление доступами/статусами через webhooks оплаты</li>
                <li>Продукт ощущается цельно: от AI‑ответов до оплаты и доступа</li>
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
            <span className="tag">Playwright→PDF</span>
            <span className="tag">Payments</span>
          </div>
        </header>

        <div className="pSlide__grid">
          <article className="pCard pCard--media">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{monitorIcon}</span>
              <div>
                <h3 className="pCard__title">Витрина</h3>
                <p className="pCard__desc">Скрин</p>
              </div>
            </div>
            <div className="pMedia">
              <img className="pMedia__img" src="/assets/photos/luna.png" alt="Луна Знает — Telegram‑бот" />
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{codeIcon}</span>
              <div>
                <h3 className="pCard__title">Сделано</h3>
                <p className="pCard__desc">Архитектура и UX</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Асинхронный Python (async/await)</li>
                <li>Assistants API + кастомные tools</li>
                <li>PDF через Playwright (HTML → PDF)</li>
                <li>Оплата: YooKassa + Telegram invoices</li>
                <li>Подписка с таймзонами и расписанием</li>
                <li>Redis для кеша и ускорения горячих операций</li>
                <li>Сценарии сообщений и ошибок, чтобы бот ощущался как продукт</li>
                <li>Быстрые ответы и аккуратная подача — без «технического» ощущения</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{sparkIcon}</span>
              <div>
                <h3 className="pCard__title">Почему это круто</h3>
                <p className="pCard__desc">Премиальный опыт в Telegram</p>
              </div>
            </div>
            <div className="pCard__body">
              <p className="pText">
                Продуманные сценарии сообщений, кнопок и состояний + быстрые ответы и готовые к отправке PDF‑материалы.
              </p>
              <p className="pText">
                Плюс монетизация и расписание, которые держат регулярный сценарий использования без ручной рутины.
              </p>
              <p className="pText">
                В итоге получился «премиальный» бот, который воспринимается как полноценный продукт, а не просто чат.
              </p>
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
  const layersIcon = usePIcon("layers");

  return (
    <article className="pSlide pSlide--two" data-accent="violet">
      <div className="pSlide__inner">
        <header className="pSlide__top">
          <div className="pSlide__brand">
            <div className="pSlide__logo pSlide__logo--ghost" aria-hidden>
              <PIcon name="grid" />
            </div>
            <div>
              <p className="pSlide__kicker">CRM + НБКИ</p>
              <span className="pSlide__link">2 кейса в одном</span>
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
                <h3 className="pCard__title">CRM</h3>
                <p className="pCard__desc">Панель статистики</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>FastAPI + PostgreSQL</li>
                <li>Отдельный сервис SQLAlchemy</li>
                <li>gRPC обмен между сервисами</li>
                <li>React/Vite: фильтры/таблицы + UI‑состояния</li>
                <li>Архитектура под быстрые запросы и прогнозируемые ответы</li>
                <li>Удобная аналитика для управленческих решений «на цифрах»</li>
              </ul>
            </div>
          </article>

          <article className="pCard">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{docIcon}</span>
              <div>
                <h3 className="pCard__title">НБКИ</h3>
                <p className="pCard__desc">PDF → JSON + сводка</p>
              </div>
            </div>
            <div className="pCard__body">
              <ul className="pList">
                <li>Telegram‑бот: приём PDF</li>
                <li>Парсер таблиц/секций + regex</li>
                <li>Структурированный JSON</li>
                <li>Понятная текстовая сводка</li>
                <li>Формат выдачи результата для удобного чтения</li>
                <li>Результат воспринимается как готовый отчёт, а не «сырой парсинг»</li>
              </ul>
            </div>
          </article>

          <article className="pCard pCard--wide">
            <div className="pCard__head">
              <span className="pIcon" aria-hidden="true">{layersIcon}</span>
              <div>
                <h3 className="pCard__title">Итог</h3>
                <p className="pCard__desc">Два прикладных продукта</p>
              </div>
            </div>
            <div className="pCard__body">
              <p className="pText">
                Оба кейса — про прикладную инженерку, стабильность и понятный интерфейс для пользователя/бизнеса.
              </p>
            </div>
          </article>
        </div>
      </div>
    </article>
  );
}
