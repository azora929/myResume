import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/section/Section";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { PIcon } from "@/components/icons/PIcon";
import { FooterPro } from "@/components/footer/FooterPro";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { usePdfDownload } from "@/hooks/usePdfDownload/usePdfDownload";
import { useSkillsStrings } from "@/hooks/useSkillsStrings/useSkillsStrings";
import { useSkillsCardsScrollAnimation } from "@/hooks/useSkillsCardsScrollAnimation/useSkillsCardsScrollAnimation";
import "@/styles/main/main.scss";

const HERO_TITLE_MAIN = "Middle Python Backend Developer";
const HERO_TITLE_ACCENT = " — AI/LLM Integrations";
const HERO_HINT_TEXT = "Пообщайтесь с нейросетью по резюме или отправьте оффер — откройте чат и напишите.";
const SCRAMBLE_CHARS = "漢字カナひらがなアイウエオ甲乙丙丁ΨΣЖЯ01#@&%$";

export function MainPage() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillsSvgRef = useRef<SVGSVGElement>(null);
  const heroTitleMainRef = useRef<HTMLSpanElement>(null);
  const heroTitleAccentRef = useRef<HTMLSpanElement>(null);
  const heroHintRef = useRef<HTMLParagraphElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useSkillsStrings({ rootRef: skillsRef, svgRef: skillsSvgRef });
  useSkillsCardsScrollAnimation(skillsRef);
  const { handlePdfDownload, isDownloading, downloadError } = usePdfDownload();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fullTitle = `${HERO_TITLE_MAIN}${HERO_TITLE_ACCENT}`;
    const titleMainEl = heroTitleMainRef.current;
    const titleAccentEl = heroTitleAccentRef.current;
    const hintEl = heroHintRef.current;

    if (!titleMainEl || !titleAccentEl || !hintEl) return;

    const setTitle = (value: string) => {
      titleMainEl.textContent = value.slice(0, HERO_TITLE_MAIN.length);
      titleAccentEl.textContent = value.slice(HERO_TITLE_MAIN.length);
    };
    const setHint = (value: string) => {
      hintEl.textContent = value;
    };

    if (reduceMotion) {
      setTitle(fullTitle);
      setHint(HERO_HINT_TEXT);
      return;
    }

    let cancelled = false;
    const rafIds: number[] = [];
    const randomChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    const isStaticChar = (ch: string) => /\s|[—.,:;!?/()-]/.test(ch);

    const buildEncryptedText = (target: string) =>
      target
        .split("")
        .map((ch) => (isStaticChar(ch) ? ch : randomChar()))
        .join("");

    const runScramble = (
      target: string,
      setText: (value: string) => void,
      revealStepMs: number
    ) =>
      new Promise<void>((resolve) => {
        const chars = target.split("");
        const noise = chars.map((ch) => (isStaticChar(ch) ? ch : randomChar()));
        let startTs = 0;
        let lastNoiseShuffleTs = 0;

        // Сразу показываем полную строку, но зашифрованную.
        setText(noise.join(""));

        const tick = (ts: number) => {
          if (cancelled) {
            resolve();
            return;
          }
          if (!startTs) startTs = ts;

          const elapsed = ts - startTs;
          const rawProgress = elapsed / revealStepMs;
          const total = chars.length;
          const normalized = Math.min(rawProgress / total, 1);
          // Небольшой ease-out для более мягкой расшифровки.
          const eased = 1 - Math.pow(1 - normalized, 1.45);
          const revealProgress = eased * total;
          const leadingIndex = Math.floor(revealProgress);

          // Редкое обновление «шума» убирает дёргание и делает анимацию мягче.
          if (ts - lastNoiseShuffleTs > 88) {
            for (let i = leadingIndex; i < chars.length; i += 1) {
              if (!isStaticChar(chars[i])) noise[i] = randomChar();
            }
            lastNoiseShuffleTs = ts;
          }

          const frame = chars
            .map((ch, idx) => {
              if (isStaticChar(ch)) return ch;
              if (idx < leadingIndex) return ch;
              if (idx > leadingIndex) return noise[idx];

              // Текущий символ «дозревает» и плавно фиксируется в конце шага.
              const localPhase = revealProgress - leadingIndex;
              return localPhase > 0.72 ? ch : noise[idx];
            })
            .join("");

          setText(frame);

          if (revealProgress >= chars.length) {
            setText(target);
            resolve();
            return;
          }

          const rafId = window.requestAnimationFrame(tick);
          rafIds.push(rafId);
        };

        const initialRafId = window.requestAnimationFrame(tick);
        rafIds.push(initialRafId);
      });

    (async () => {
      // Обе строки сразу видны полностью, но в зашифрованном виде.
      setTitle(buildEncryptedText(fullTitle));
      setHint(buildEncryptedText(HERO_HINT_TEXT));

      await runScramble(fullTitle, setTitle, 76);
      if (cancelled) return;
      await runScramble(HERO_HINT_TEXT, setHint, 44);
    })();

    return () => {
      cancelled = true;
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, []);

  return (
    <main className="main-page">
      <Section id="hero" variant="hero">
        <div className="hero__content">
          <p className="hero__label">Резюме</p>
          <h1 className="hero__title">
            <span ref={heroTitleMainRef}>{HERO_TITLE_MAIN}</span>
            <span className="hero__title-accent" ref={heroTitleAccentRef}>{HERO_TITLE_ACCENT}</span>
          </h1>
          <p className="hero__hint" ref={heroHintRef}>{HERO_HINT_TEXT}</p>
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
                Python backend (Django, FastAPI, Celery), AI/LLM (OpenAI Assistants, Realtime API, LangGraph), стриминг (WebSocket/SSE), платежи, Telegram-боты, gRPC, React — из реальных продуктов.
              </p>
            </header>

            <div className="sCard-slot">
              <article className="sCard sCard--wide">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="person" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Approach & Experience</h3>
                    <p className="sCard__desc">Middle Python Backend Developer · AI/LLM · production systems</p>
                  </div>
                </div>

                <div className="sCard__body prose">
                  <p>
                    Я — Middle Python Backend Developer, 22 года, в разработке с 19 лет, коммерческий опыт около 3 лет. Специализируюсь на backend-разработке, AI/LLM-интеграциях и сложной продуктовой бизнес-логике: API, realtime-сценарии, фоновые пайплайны, платежные механики и production-инфраструктура. Работаю со стеком Python, FastAPI, Django/DRF, PostgreSQL, MongoDB, Redis, SQLAlchemy, asyncpg, asyncio, aiohttp, gRPC, WebSocket, Celery, Docker, Kubernetes, Nginx и Linux; интегрировал OpenAI API, LangGraph, Telegram Bot API, YooKassa и внешние сервисы. Есть опыт fullstack-разработки, но основной фокус — backend, надежность сервисов, производительность и сложные пользовательские сценарии.
                  </p>
                </div>
              </article>
            </div>

            <div className="sCard-slot">
              <article className="sCard sCard--wide sCard--experience" data-accent="neutral">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="code" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Work Experience</h3>
                    <p className="sCard__desc">StrokovAI (стартап) · Python Backend / Fullstack Developer (Middle) · апрель 2023 — сейчас</p>
                  </div>
                </div>

                <div className="sCard__body prose">
                  <p>
                    Разрабатываю backend-сервисы, AI-функциональность и продуктовую бизнес-логику для веб-приложений,
                    Telegram-сервисов и AI-продуктов в команде из 3 человек. Участвую в обсуждении архитектуры и задач,
                    собираю и анализирую требования от заказчика, декомпозирую работу и делегирую задачи внутри команды.
                  </p>
                </div>

                <ul className="chips">
                  <li className="chip">Python</li>
                  <li className="chip">FastAPI</li>
                  <li className="chip">Django / DRF</li>
                  <li className="chip">PostgreSQL</li>
                  <li className="chip">MongoDB</li>
                  <li className="chip">Redis</li>
                  <li className="chip">gRPC</li>
                  <li className="chip">WebSocket</li>
                  <li className="chip">WebRTC</li>
                  <li className="chip">Celery</li>
                  <li className="chip">OpenAI API</li>
                  <li className="chip">LangGraph</li>
                  <li className="chip">Docker / Kubernetes</li>
                  <li className="chip">Nginx</li>
                </ul>

                <div className="sDivider"></div>

                <div className="sExperience__grid">
                  <div>
                    <h4 className="sExperience__title">Задачи и зона ответственности</h4>
                    <ul className="sList">
                      <li>Разрабатывал production-ready backend на FastAPI и Django, реализовывал REST API, gRPC-сервисы и интеграции</li>
                      <li>Участвовал в проектировании сервисов, обсуждении архитектуры и выборе технических решений с командой</li>
                      <li>Собирал и анализировал требования от заказчика, уточнял бизнес-логику и переводил задачи в техническую реализацию</li>
                      <li>Декомпозировал задачи, распределял и делегировал часть работы внутри команды</li>
                      <li>Оптимизировал БД и backend: индексы, bulk-операции, сырые SQL, устранение N+1, транзакции, pooling</li>
                      <li>Реализовывал retry/timeout/rate-limit/state management, realtime-сценарии и worker-based pipeline на Celery</li>
                      <li>Интегрировал OpenAI API/Assistants/Realtime/Responses, LangGraph, Telegram Bot API, YooKassa</li>
                      <li>Настраивал инфраструктуру: Docker, Kubernetes, Nginx, Linux, SSL/TLS; тесты на pytest и поддержка production</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="sExperience__title">Результат</h4>
                    <ul className="sList">
                      <li>Реализовал production-ready backend для AI- и веб-продуктов</li>
                      <li>Снизил задержки и улучшил производительность backend-сервисов и БД</li>
                      <li>Участвовал в проработке требований, архитектуры и распределении задач внутри команды</li>
                      <li>Развивал сложные пользовательские сценарии с AI, платежами, состояниями и интеграциями</li>
                      <li>Поддерживал и масштабировал production-сервисы с упором на надежность, производительность и UX</li>
                    </ul>
                  </div>
                </div>

                <div className="sExperience__actions">
                  <a href="#projects" className="sExperience__cta">
                    Смотреть проекты
                  </a>
                </div>
              </article>
            </div>

            <div className="skillsPro__grid">
              <div className="sCard-slot">
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
                  <li className="chip">Celery</li>
                  <li className="chip">REST API</li>
                  <li className="chip">WebSocket streaming</li>
                  <li className="chip">asyncio</li>
                  <li className="chip">gRPC</li>
                  <li className="chip">Apache Kafka</li>
                  <li className="chip">Microservices</li>
                  <li className="chip">SQL</li>
                  <li className="chip">PostgreSQL</li>
                  <li className="chip">Redis</li>
                  <li className="chip">NoSQL</li>
                  <li className="chip">MongoDB</li>
                  <li className="chip">SQLAlchemy</li>
                  <li className="chip">CI/CD</li>
                  <li className="chip">aiohttp</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>REST API: контракты, валидация (Pydantic), интеграции</li>
                  <li>gRPC: proto, кодогенерация, обмен между сервисами</li>
                  <li>Apache Kafka: использовал как очередь сообщений и транспорт для event-driven взаимодействия сервисов</li>
                  <li>Celery: использовал для реализации фоновых воркеров и асинхронных задач</li>
                  <li>Платежи: YooKassa, Telegram Payments, webhooks, баланс, подписки</li>
                  <li>БД: миграции, транзакции, индексы; Redis — кэш, rate limiting, TTL</li>
                  <li>Надёжность: ретраи, обработка ошибок, логирование</li>
                </ul>
              </article>
              </div>

              <div className="sCard-slot">
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
              </div>

              <div className="sCard-slot">
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
              </div>

              <div className="sCard-slot">
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
                  <li className="chip">LangGraph</li>
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
                  <li>Оркестрация AI-пайплайнов и сценариев с LangGraph для управляемого agent-flow</li>
                  <li>Динамические промпты и набор tools по этапу пользователя; conversational AI</li>
                  <li>Realtime API, Whisper, TTS (VoiceKit, SpeechKit); учёт токенов, кэш контекста в Redis</li>
                </ul>
              </article>
              </div>

              <div className="sCard-slot">
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
              </div>

              <div className="sCard-slot">
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
            </div>

            <div className="skillsPro__metaRow">
              <div className="sCard-slot">
              <article className="sCard" data-accent="neutral">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="rocket" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Key Projects</h3>
                    <p className="sCard__desc">Коммерческие и pet-проекты с измеримым результатом</p>
                  </div>
                </div>
                <ul className="sList">
                  <li><strong>EvoSpeak / Yespeak:</strong> двухпоточный AI-flow, ускорение генерации задач с минут до секунд</li>
                  <li><strong>Luna:</strong> Telegram AI-сервис с подпиской, платежами, voice-flow и production-ready backend</li>
                  <li><strong>DJSet Analytic:</strong> worker-пайплайн (Celery/Redis/MongoDB), AI-постобработка и DOCX-экспорт</li>
                  <li><strong>ИИ Препод:</strong> backend EdTech-платформы с AI-тьютором и нагрузкой до ~1000 пользователей</li>
                </ul>
              </article>
              </div>
              <div className="sCard-slot">
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
