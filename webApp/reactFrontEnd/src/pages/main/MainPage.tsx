import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/section/Section";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { PIcon } from "@/components/icons/PIcon";
import { FooterPro } from "@/components/footer/FooterPro";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "@/styles/main/main.scss";

export function MainPage() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillsSvgRef = useRef<SVGSVGElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const root = skillsRef.current;
    const svg = skillsSvgRef.current;
    if (!root || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const make = (t: string) => document.createElementNS(NS, t);
    const supportsPointer = "PointerEvent" in window;
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    let rect: DOMRect;
    let w = 0;
    let h = 0;
    let rafId = 0;
    let active = true;

    const cfg = {
      strings: 20,
      points: 28,
      stiffness: 0.05,
      coupling: 0.12,
      damping: 0.92,
      mouseRadius: 120,
      impulse: 52,
      curve: 1.2,
      drift: 0.24,
      nodeStep: 12,
      nodeRadius: 10,
    };

    const state = {
      t: 0,
      frame: 0,
      mouse: { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 },
      strings: [] as Array<{
        pts: Array<{ x0: number; x: number; vx: number; y: number; amp: number; phase: number }>;
        path: SVGPathElement;
        nodes: Array<{ i: number; el: SVGCircleElement; seed: number }>;
      }>,
    };

    const applyCfg = () => {
      const mobile = isMobile();
      cfg.strings = mobile ? 14 : 20;
      cfg.points = mobile ? 22 : 28;
      cfg.stiffness = mobile ? 0.045 : 0.05;
      cfg.coupling = mobile ? 0.1 : 0.12;
      cfg.damping = mobile ? 0.93 : 0.92;
      cfg.mouseRadius = mobile ? 90 : 120;
      cfg.impulse = mobile ? 40 : 52;
      cfg.curve = mobile ? 1.0 : 1.2;
      cfg.drift = mobile ? 0.18 : 0.24;
      cfg.nodeStep = mobile ? 14 : 12;
      cfg.nodeRadius = mobile ? 8 : 10;
    };

    const setSize = () => {
      const mobile = isMobile();
      rect = root.getBoundingClientRect();
      w = Math.max(mobile ? 360 : 700, Math.floor(rect.width));
      h = Math.max(mobile ? 420 : 560, Math.floor(rect.height));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("preserveAspectRatio", "none");
    };

    const buildDefs = () => {
      svg.innerHTML = "";
      const defs = make("defs");

      const grad = make("linearGradient");
      grad.setAttribute("id", "strGrad");
      grad.setAttribute("x1", "0");
      grad.setAttribute("y1", "0");
      grad.setAttribute("x2", "0");
      grad.setAttribute("y2", "1");
      grad.innerHTML = `
        <stop offset="0" stop-color="rgba(103,232,249,.26)"/>
        <stop offset="0.55" stop-color="rgba(255,255,255,.10)"/>
        <stop offset="1" stop-color="rgba(165,140,255,.22)"/>
      `;

      const glow = make("filter");
      glow.setAttribute("id", "strGlow");
      glow.setAttribute("x", "-40%");
      glow.setAttribute("y", "-40%");
      glow.setAttribute("width", "180%");
      glow.setAttribute("height", "180%");
      glow.innerHTML = `
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      `;

      const node = make("radialGradient");
      node.setAttribute("id", "strNode");
      node.innerHTML = `
        <stop offset="0" stop-color="rgba(255,255,255,.70)"/>
        <stop offset="0.35" stop-color="rgba(103,232,249,.26)"/>
        <stop offset="1" stop-color="rgba(103,232,249,0)"/>
      `;

      defs.append(grad, glow, node);
      svg.appendChild(defs);
    };

    const pathFromPoints = (pts: Array<{ x: number; y: number }>) => {
      const p0 = pts[0];
      let d = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`;
      for (let i = 1; i < pts.length - 1; i += 1) {
        const p = pts[i];
        const n = pts[i + 1];
        const mx = (p.x + n.x) / 2;
        const my = (p.y + n.y) / 2;
        d += ` Q ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      const last = pts[pts.length - 1];
      d += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
      return d;
    };

    const rebuild = () => {
      applyCfg();
      setSize();
      buildDefs();
      state.strings = [];

      const leftPad = w * 0.06;
      const rightPad = w * 0.94;

      for (let s = 0; s < cfg.strings; s += 1) {
        const denom = Math.max(1, cfg.strings - 1);
        const xBase = leftPad + (s / denom) * (rightPad - leftPad);
        const tilt = (Math.random() * 0.14 - 0.07) * w;
        const amp = 0.8 + Math.random() * 1.45;

        const pts = [];
        for (let i = 0; i < cfg.points; i += 1) {
          const y = (i / (cfg.points - 1)) * h;
          const t = i / (cfg.points - 1);
          const s1 = Math.sin(t * Math.PI * 2.0 + s * 0.3);
          const s2 = Math.sin(t * Math.PI * 4.0 + s * 0.2) * 0.55;
          const s3 = Math.sin(t * Math.PI * 6.0 + s * 0.1) * 0.22;
          const baseWiggle = (s1 + s2 + s3) * cfg.curve * 10.5 * amp;
          const x0 = xBase + tilt * (t - 0.5) + baseWiggle;

          pts.push({ x0, x: x0, vx: 0, y, amp, phase: Math.random() * Math.PI * 2 });
        }

        const path = make("path") as SVGPathElement;
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "url(#strGrad)");
        path.setAttribute("stroke-width", (0.95 + Math.random() * 0.95).toFixed(2));
        path.setAttribute("opacity", (0.16 + Math.random() * 0.18).toFixed(2));
        path.setAttribute("filter", "url(#strGlow)");
        svg.appendChild(path);

        const nodesG = make("g") as SVGGElement;
        nodesG.setAttribute("opacity", "0.62");
        svg.appendChild(nodesG);

        const nodes = [];
        const step = cfg.nodeStep;
        for (let i = 0; i < cfg.points; i += step) {
          const c = make("circle") as SVGCircleElement;
          c.setAttribute("r", cfg.nodeRadius.toString());
          c.setAttribute("fill", "url(#strNode)");
          c.setAttribute("filter", "url(#strGlow)");
          nodesG.appendChild(c);
          nodes.push({ i, el: c, seed: Math.random() * Math.PI * 2 });
        }

        state.strings.push({ pts, path, nodes });
      }

      for (const st of state.strings) {
        st.path.setAttribute("d", pathFromPoints(st.pts));
      }
    };

    const updatePointer = (x: number, y: number) => {
      rect = root.getBoundingClientRect();
      const px = x - rect.left;
      const py = y - rect.top;

      state.mouse.vx = px - state.mouse.px;
      state.mouse.vy = py - state.mouse.py;
      state.mouse.px = px;
      state.mouse.py = py;
      state.mouse.x = px;
      state.mouse.y = py;
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY);
    };

    const onLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
      state.mouse.vx = 0;
      state.mouse.vy = 0;
    };

    const tick = () => {
      if (!active) {
        rafId = 0;
        return;
      }
      state.t += 0.016;
      state.frame += 1;

      const mx = state.mouse.x;
      const my = state.mouse.y;
      const mv = Math.hypot(state.mouse.vx, state.mouse.vy);
      const kick = Math.min(1.7, 0.55 + mv / 26);

      for (const st of state.strings) {
        const pts = st.pts;

        if (mx > -1000) {
          for (let i = 1; i < pts.length - 1; i += 1) {
            const p = pts[i];
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.hypot(dx, dy);
            if (dist > cfg.mouseRadius) continue;

            const influence = 1 - dist / cfg.mouseRadius;
            const dir = dx >= 0 ? 1 : -1;
            p.vx += dir * influence * cfg.impulse * kick * 0.028;

            if (pts[i - 1]) pts[i - 1].vx += dir * influence * cfg.impulse * kick * 0.01;
            if (pts[i + 1]) pts[i + 1].vx += dir * influence * cfg.impulse * kick * 0.01;
          }
        }

        for (let i = 1; i < pts.length - 1; i += 1) {
          const p = pts[i];
          const breathe = Math.sin(state.t * 0.95 + p.phase + i * 0.12) * cfg.drift * 2.0 * p.amp;
          const target = p.x0 + breathe;
          p.vx += (target - p.x) * cfg.stiffness;
        }

        for (let i = 1; i < pts.length - 1; i += 1) {
          const p = pts[i];
          const left = pts[i - 1];
          const right = pts[i + 1];
          const lap = left.x + right.x - 2 * p.x;
          p.vx += lap * cfg.coupling;
        }

        for (let i = 1; i < pts.length - 1; i += 1) {
          const p = pts[i];
          p.vx *= cfg.damping;
          p.x += p.vx;
        }

        pts[0].x = pts[0].x0;
        pts[0].vx = 0;
        pts[pts.length - 1].x = pts[pts.length - 1].x0;
        pts[pts.length - 1].vx = 0;

        st.path.setAttribute("d", pathFromPoints(pts));

        if (state.frame % 3 === 0) {
          for (const n of st.nodes) {
            const p = pts[n.i];
            const breathe = 0.55 + 0.45 * Math.sin(state.t * 1.25 + n.seed);
            const dist = Math.hypot(p.x - mx, p.y - my);
            const pop = dist < 150 ? 1 - dist / 150 : 0;

            n.el.setAttribute("cx", p.x.toFixed(1));
            n.el.setAttribute("cy", p.y.toFixed(1));
            n.el.setAttribute("opacity", (0.1 + breathe * 0.2 + pop * 0.3).toFixed(3));
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rebuild();

    if (!reduced) rafId = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && !rafId && !reduced) {
          rafId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(root);

    window.addEventListener("resize", rebuild, { passive: true });
    if (supportsPointer) {
      root.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", onLeave, { passive: true });
    } else {
      root.addEventListener("mousemove", onMouseMove, { passive: true });
      root.addEventListener("mouseleave", onLeave, { passive: true });
    }
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onLeave, { passive: true });
    root.addEventListener("touchcancel", onLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", rebuild);
      if (supportsPointer) {
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", onLeave);
      } else {
        root.removeEventListener("mousemove", onMouseMove);
        root.removeEventListener("mouseleave", onLeave);
      }
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onLeave);
      root.removeEventListener("touchcancel", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const handlePdfDownload = async () => {
    if (isDownloading) return;
    setDownloadError("");
    setIsDownloading(true);

    try {
      const response = await fetch("/api/pdf");
      if (!response.ok) {
        throw new Error("PDF generation failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Не удалось создать PDF. Попробуйте ещё раз.");
    } finally {
      setIsDownloading(false);
    }
  };

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
            Backend, API, стриминг ответов нейросети и живой UX в продуктах
          </p>
          <div className="hero__actions">
            <a href="#skills" className="hero__cta">
              <span>Смотреть</span>
              <span className="hero__cta-icon" aria-hidden="true">
                <PIcon name="arrow-down" />
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
                <PIcon name="chat" />
              </button>
              {downloadError ? <p className="hero__download-error">{downloadError}</p> : null}
            </div>
          </div>
          <p className="hero__hint">
            Пообщайтесь с нейросетью по резюме или отправьте оффер — откройте чат и напишите.
          </p>
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
                  <PIcon name="spark" />
                </span>
                <div>
                  <h3 className="sCard__title">Подход и опыт</h3>
                  <p className="sCard__desc">Backend-first fullstack, продукты с AI и монетизацией</p>
                </div>
              </div>

              <div className="sCard__body prose">
                <p>
                  Я — Middle Python-разработчик, 22 года; в разработке с 19 лет, коммерческий опыт около 3 лет. Фокус на backend и на то, чтобы продукт ощущался живым: нейросети в интерфейсе отвечают быстро и предсказуемо, а монетизация — платежи, подписки, боты — не преподносит сюрпризов на проде. За плечами уже платформы с AI-тьютором (EvoSpeak, ИИ Препод), Telegram-боты с оплатой и сценариями (Luna, НБКИ), CRM с gRPC и аналитикой, парсинг PDF и генерация отчётов. Фичи веду от идеи до продовой нагрузки: продуманные контракты API, валидация, обработка ошибок и поведение в краевых случаях — так, чтобы и пользователю, и команде было спокойно.
                </p>
                <p>
                  В бэкенде уверенно собираю и поддерживаю REST (FastAPI, Django, DRF) и gRPC (Protocol Buffers, кодогенерация), поднимаю WebSocket и SSE под стриминг ответов нейросети. Интегрирую платежи (YooKassa, Telegram Payments, webhooks), SMS и Telegram-ботов, планировщики с учётом таймзоны пользователя — так, чтобы сервисы держали нагрузку и не подводили в нештатных ситуациях. С БД работаю аккуратно: PostgreSQL и Redis (кеш, rate limit, channel layers), миграции, транзакции, атомарные обновления, в том числе для очередей покупок и статусов подписок.
                </p>
                <p>
                  В AI/LLM-слое опираюсь на OpenAI Assistants API (threads, runs, стриминг), кастомные tools и динамические промпты под этап пользователя; для голоса — Realtime API, Whisper и TTS (VoiceKit, SpeechKit). Реализовывал сценарии с двумя потоками: диалог в реальном времени плюс фоновая генерация заданий, чтобы интерфейс не замирал в ожидании. На фронте собираю страницы на React, TypeScript и Vite, стыкую со стримингом и довожу состояния — лоадеры, ошибки, пустые экраны — до ощущения цельного продукта, а не набора экранов.
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
                    <h3 className="sCard__title">Backend</h3>
                    <p className="sCard__desc">REST, gRPC, БД, платежи, Telegram</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">Python (async)</li>
                  <li className="chip">FastAPI</li>
                  <li className="chip">Django / DRF</li>
                  <li className="chip">Daphne, Channels</li>
                  <li className="chip">PostgreSQL</li>
                  <li className="chip">Redis</li>
                  <li className="chip">SQLAlchemy</li>
                  <li className="chip">gRPC</li>
                  <li className="chip">python-telegram-bot</li>
                  <li className="chip">aiohttp</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>REST API: контракты, валидация (Pydantic), интеграции</li>
                  <li>gRPC: proto, кодогенерация, реестр таблиц, единая точка доступа к БД</li>
                  <li>Платежи: YooKassa, Telegram Payments, webhooks, баланс, подписки</li>
                  <li>БД: миграции, транзакции, индексы, оптимизация, pooling; кэш в Redis (контекст, rate limit, channel layers)</li>
                  <li>Надёжность: ретраи, обработка ошибок, логирование; интеграции без «хрупких» связей на проде</li>
                </ul>
              </article>

              <article className="sCard" data-accent="violet">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="stream" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Streaming & UX</h3>
                    <p className="sCard__desc">WebSocket, SSE, два потока, живые состояния</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">WebSocket</li>
                  <li className="chip">SSE</li>
                  <li className="chip">Realtime API</li>
                  <li className="chip">Два потока</li>
                  <li className="chip">Loading/Error/Empty</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>Стриминг ответов нейросети: интерфейс получает данные по мере готовности</li>
                  <li>Два потока: диалог в реальном времени + фоновая генерация заданий в отдельном thread</li>
                  <li>Лоадеры, ошибки, пустые состояния — чтобы продукт ощущался цельным</li>
                  <li>Стыковка React с WebSocket/SSE и предсказуемое поведение при задержках</li>
                </ul>
              </article>

              <article className="sCard" data-accent="mint">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="cube" />
                  </span>
                  <div>
                    <h3 className="sCard__title">Инфра и отчёты</h3>
                    <p className="sCard__desc">Планировщики, PDF, WebApp, тесты</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">Docker / compose</li>
                  <li className="chip">Kubernetes</li>
                  <li className="chip">CI/CD</li>
                  <li className="chip">Playwright → PDF</li>
                  <li className="chip">Jinja2</li>
                  <li className="chip">Планировщики</li>
                  <li className="chip">Timezone-aware</li>
                  <li className="chip">WebApp (HTTPS/ngrok)</li>
                  <li className="chip">pytest</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>Docker, Docker Compose; Kubernetes (базовое понимание); CI/CD, этапы build/test/deploy</li>
                  <li>Генерация PDF: Playwright, Jinja2-шаблоны; натальные/ведические карты (Matplotlib и др.)</li>
                  <li>Планировщики с привязкой к таймзоне: расклады, вечерние вопросы, истечение подписки; фоновые задачи</li>
                  <li>WebApp в Telegram: HTTPS (ngrok в dev, свой домен в prod). Тесты (pytest)</li>
                </ul>
              </article>

              <article className="sCard" data-accent="cyan">
                <div className="sCard__head">
                  <span className="sIcon" aria-hidden="true">
                    <PIcon name="brain" />
                  </span>
                  <div>
                    <h3 className="sCard__title">AI/LLM</h3>
                    <p className="sCard__desc">Assistants API, Realtime, tools, голос</p>
                  </div>
                </div>

                <ul className="chips">
                  <li className="chip">Assistants API</li>
                  <li className="chip">Realtime API</li>
                  <li className="chip">Custom tools</li>
                  <li className="chip">tiktoken</li>
                  <li className="chip">Whisper / TTS</li>
                </ul>

                <div className="sDivider"></div>

                <ul className="sList">
                  <li>OpenAI Assistants: threads, runs, стриминг; кастомные tools (request_task_generation, check_task_status и др.)</li>
                  <li>Динамические промпты и набор tools по этапу пользователя; миграция истории диалога</li>
                  <li>Realtime API для голоса в реальном времени; Whisper (транскрипция), TTS (VoiceKit gRPC, SpeechKit)</li>
                  <li>Учёт токенов (tiktoken), стоимость USD→RUB по курсу ЦБ; кэш контекста в Redis с инвалидацией</li>
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
