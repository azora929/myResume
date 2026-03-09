import { useRef, useState } from "react";
import { Section } from "@/components/section/Section";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { PIcon } from "@/components/icons/PIcon";
import { FooterPro } from "@/components/footer/FooterPro";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { usePdfDownload } from "@/hooks/usePdfDownload/usePdfDownload";
import { useSkillsStrings } from "@/hooks/useSkillsStrings/useSkillsStrings";
import "@/styles/main/main.scss";

export function MainPage() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillsSvgRef = useRef<SVGSVGElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useSkillsStrings({ rootRef: skillsRef, svgRef: skillsSvgRef });
  const { handlePdfDownload, isDownloading, downloadError } = usePdfDownload();

  return (
    <main className="main-page">
      <Section id="hero" variant="hero">
        <div className="hero__content">
          <p className="hero__label">Резюме</p>
          <h1 className="hero__title">
            Middle Python Fullstack Developer
            <span className="hero__title-accent"> — AI/LLM Integrations</span>
          </h1>
          <p className="hero__hint">
            Пообщайтесь с нейросетью по резюме или отправьте оффер — откройте чат и напишите.
          </p>
          <div className="hero__actions">
            <a href="#skills" className="hero__cta">
              <span>Смотреть</span>
              <span className="hero__cta-icon" aria-hidden="true">
                <PIcon name="arrow-down"/>
              </span>
            </a>

            <div className="hero__actions-right">
              <button
                  className="hero__btn hero__btn--pdf"
                  type="button"
                  onClick={handlePdfDownload}
                  disabled={isDownloading}
                  aria-busy={isDownloading}
              >
                {isDownloading ? "Готовим PDF..." : "Выгрузить в PDF резюме"}
              </button>
              <button
                  className="hero__btn hero__btn--chat"
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  aria-label="Открыть чат с нейросетью"
              >
                <PIcon name="chat"/>
              </button>
              {downloadError ? <p className="hero__download-error">{downloadError}</p> : null}
            </div>
          </div>
        </div>
      </Section>

      <div className="section-aurora-divider" aria-hidden="true">
        <div className="section-aurora-divider__band"></div>
      </div>

      <Section id="skills" variant="skills">
        <div className="skillsPro" ref={skillsRef}>
          <svg className="skillsPro__bg" ref={skillsSvgRef} aria-hidden="true"></svg>

          <div className="skillsPro__inner content-section">
            <header className="skillsPro__header">
              <p className="skillsPro__kicker">
                <span className="dot" aria-hidden="true"></span>
                Skills
              </p>
              <h2 className="content-section__title skillsPro__title">Skills & Strengths</h2>
              <p className="skillsPro__subtitle">
                Python backend (Django, FastAPI), AI/LLM (OpenAI Assistants, Realtime API), стриминг (WebSocket/SSE), платежи, Telegram-боты, gRPC, React — из реальных продуктов.
              </p>
            </header>

            <article className="sCard sCard--wide">
              <div className="sCard__head">
                <span className="sIcon" aria-hidden="true">
                  <PIcon name="person" />
                </span>
                <div>
                  <h3 className="sCard__title">Approach & Experience</h3>
                  <p className="sCard__desc">Backend-first fullstack, продукты с AI и монетизацией</p>
                </div>
              </div>

              <div className="sCard__body prose">
                <p>
                  Я — Middle Python-разработчик (backend-first fullstack), 22 года, в разработке с 19 лет, около 3 лет коммерческого опыта. Создаю продуктовые системы с AI и монетизацией, где важны скорость ответа, стабильность и предсказуемость на проде. Работал над платформами с AI-тьютором (EvoSpeak, ИИ Препод), Telegram-ботами с платежами (Luna, НБКИ), CRM с gRPC и аналитикой, а также сервисами парсинга PDF и генерации отчётов. Обычно веду фичи от идеи до продакшена: проектирование API, обработка ошибок, валидация и продуманное поведение системы в краевых сценариях.
                </p>
                <p>
                  В backend работаю с FastAPI, Django, DRF и gRPC, реализую WebSocket/SSE стриминг для AI, интегрирую платежи (YooKassa, Telegram Payments), Telegram-ботов и внешние сервисы. Использую PostgreSQL и Redis для транзакций, кеширования и очередей. В AI-слое работаю с OpenAI Assistants API, streaming, tools, а также голосовыми технологиями (Whisper, TTS). На фронте использую React + TypeScript + Vite, подключая стриминг и продумывая состояния интерфейса, чтобы продукт ощущался быстрым и цельным.
                </p>
              </div>
            </article>

            <div className="skillsPro__grid">
              <article className="sCard" data-accent="cyan">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="server" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Backend & Architecture</h3>
                    <p className="sCard__desc">REST, gRPC, микросервисы, БД, платежи</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">Python</li>
                  <li className="chip">FastAPI</li>
                  <li className="chip">Django / DRF</li>
                  <li className="chip">REST API</li>
                  <li className="chip">WebSocket streaming</li>
                  <li className="chip">asyncio</li>
                  <li className="chip">gRPC</li>
                  <li className="chip">Microservices</li>
                  <li className="chip">PostgreSQL</li>
                  <li className="chip">Redis</li>
                  <li className="chip">SQLAlchemy</li>
                  <li className="chip">aiohttp</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>REST API: контракты, валидация (Pydantic), интеграции</li>
                  <li>gRPC: proto, кодогенерация, обмен между сервисами</li>
                  <li>Платежи: YooKassa, Telegram Payments, webhooks, баланс, подписки</li>
                  <li>БД: миграции, транзакции, индексы; Redis — кэш, rate limiting, TTL</li>
                  <li>Надёжность: ретраи, обработка ошибок, логирование</li>
                </ul>
              </article>

              <article className="sCard" data-accent="violet">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="stream" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Real-time & Streaming</h3>
                    <p className="sCard__desc">WebSocket, SSE, event-driven, живые состояния</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">WebSockets</li>
                  <li className="chip">SSE</li>
                  <li className="chip">Streaming responses</li>
                  <li className="chip">Realtime API</li>
                  <li className="chip">Event-driven</li>
                  <li className="chip">Loading/Error/Empty</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>Стриминг ответов нейросети: интерфейс получает данные по мере готовности</li>
                  <li>Два потока: диалог в реальном времени + фоновая генерация в отдельном thread</li>
                  <li>Лоадеры, ошибки, пустые состояния — цельное ощущение продукта</li>
                  <li>Стыковка React с WebSocket/SSE при задержках и обрывах</li>
                </ul>
              </article>

              <article className="sCard" data-accent="mint">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="cube" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Infrastructure & Reports</h3>
                    <p className="sCard__desc">Docker, K8s, Nginx, SSL, PDF, планировщики</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">Docker</li>
                  <li className="chip">Kubernetes</li>
                  <li className="chip">Nginx</li>
                  <li className="chip">SSL/TLS</li>
                  <li className="chip">CI/CD</li>
                  <li className="chip">Playwright → PDF</li>
                  <li className="chip">Jinja2</li>
                  <li className="chip">Планировщики</li>
                  <li className="chip">Timezone-aware</li>
                  <li className="chip">pytest</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>Docker, Kubernetes: деплой, поды, сервисы; Nginx reverse proxy, SSL/TLS</li>
                  <li>Генерация PDF: Playwright, Jinja2-шаблоны; отчёты, натальные карты</li>
                  <li>Планировщики с таймзоной: расклады, истечение подписки; фоновые задачи</li>
                  <li>CI/CD: build/test/deploy. Тесты: pytest, manual и integration testing</li>
                </ul>
              </article>

              <article className="sCard" data-accent="cyan">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="brain" />
                  </span>
                  <div>
                    <h3 className="sCard__title">AI / LLM Integration</h3>
                    <p className="sCard__desc">LLM API, tools, prompt engineering, streaming</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">LLM API</li>
                  <li className="chip">AI agent tools</li>
                  <li className="chip">Prompt engineering</li>
                  <li className="chip">Streaming LLM</li>
                  <li className="chip">Assistants API</li>
                  <li className="chip">Realtime API</li>
                  <li className="chip">Whisper / TTS</li>
                  <li className="chip">tiktoken</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>OpenAI Assistants: threads, runs, стриминг; кастомные tools (в т.ч. gRPC → Telegram)</li>
                  <li>Динамические промпты и набор tools по этапу пользователя; conversational AI</li>
                  <li>Realtime API, Whisper, TTS (VoiceKit, SpeechKit); учёт токенов, кэш контекста в Redis</li>
                </ul>
              </article>

              <article className="sCard" data-accent="mint">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="monitor" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Frontend</h3>
                    <p className="sCard__desc">React, Vite, стриминг в UI</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">React</li>
                  <li className="chip">TypeScript</li>
                  <li className="chip">Vite</li>
                  <li className="chip">WebSocket in UI</li>
                  <li className="chip">SASS</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>Страницы на React + TypeScript + Vite, стыковка со стримингом и состояниями</li>
                  <li>Лоадеры, ошибки, пустые экраны — до ощущения цельного продукта</li>
                </ul>
              </article>

              <article className="sCard" data-accent="neutral">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="globe" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Languages</h3>
                    <p className="sCard__desc">Коммуникация</p>
                  </div>
                </div>
                <ul className="sList">
                  <li>Русский — родной</li>
                  <li>Английский — B1</li>
                  <li>Свободно читаю техническую документацию и спецификации</li>
                </ul>
              </article>
            </div>

            <div className="skillsPro__metaRow">
              <article className="sCard" data-accent="neutral">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="education" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Education</h3>
                    <p className="sCard__desc">База + продолжаю учиться</p>
                  </div>
                </div>
                <ul className="sList">
                  <li>СПО (колледж): 09.02.07 «Информационные системы и программирование» — красный диплом</li>
                  <li>Высшее образование: в процессе (не IT‑направление)</li>
                  <li>Постоянно поддерживаю себя в форме через практику и самообучение</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-aurora-divider" aria-hidden="true">
        <div className="section-aurora-divider__band"></div>
      </div>

      <ProjectsSection />

      <div className="section-aurora-divider" aria-hidden="true">
        <div className="section-aurora-divider__band"></div>
      </div>

      <FooterPro />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
