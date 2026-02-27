import { useEffect, useRef } from "react";
import { Section } from "@/components/section/Section";
import "@/styles/main/main.scss";

export function MainPage() {
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillsSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = skillsRef.current;
    const svg = skillsSvgRef.current;
    if (!root || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const make = (t: string) => document.createElementNS(NS, t);

    let rect: DOMRect;
    let w = 0;
    let h = 0;
    let rafId = 0;

    const cfg = {
      strings: 20,
      points: 42,
      stiffness: 0.06,
      coupling: 0.14,
      damping: 0.9,
      mouseRadius: 120,
      impulse: 26,
      curve: 0.9,
      drift: 0.22,
    };

    const state = {
      t: 0,
      mouse: { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 },
      strings: [] as Array<{
        pts: Array<{ x0: number; x: number; vx: number; y: number; amp: number; phase: number }>;
        path: SVGPathElement;
        nodes: Array<{ i: number; el: SVGCircleElement; seed: number }>;
      }>,
    };

    const setSize = () => {
      rect = root.getBoundingClientRect();
      w = Math.max(700, Math.floor(rect.width));
      h = Math.max(520, Math.floor(rect.height));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("preserveAspectRatio", "none");
    };

    const buildDefs = () => {
      svg.innerHTML = "";
      const defs = make("defs");

      const grad = make("linearGradient");
      grad.setAttribute("id", "orgGrad");
      grad.setAttribute("x1", "0");
      grad.setAttribute("y1", "0");
      grad.setAttribute("x2", "0");
      grad.setAttribute("y2", "1");
      grad.innerHTML = `
        <stop offset="0" stop-color="rgba(90,220,255,.34)"/>
        <stop offset="0.5" stop-color="rgba(255,120,200,.22)"/>
        <stop offset="1" stop-color="rgba(120,255,180,.20)"/>
      `;

      const glow = make("filter");
      glow.setAttribute("id", "orgGlow");
      glow.setAttribute("x", "-40%");
      glow.setAttribute("y", "-40%");
      glow.setAttribute("width", "180%");
      glow.setAttribute("height", "180%");
      glow.innerHTML = `
        <feGaussianBlur stdDeviation="1.8" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      `;

      const node = make("radialGradient");
      node.setAttribute("id", "orgNode");
      node.innerHTML = `
        <stop offset="0" stop-color="rgba(255,255,255,.85)"/>
        <stop offset="0.35" stop-color="rgba(90,220,255,.35)"/>
        <stop offset="1" stop-color="rgba(90,220,255,0)"/>
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
      setSize();
      buildDefs();
      state.strings = [];

      const leftPad = w * 0.06;
      const rightPad = w * 0.94;

      for (let s = 0; s < cfg.strings; s += 1) {
        const xBase = leftPad + (s / (cfg.strings - 1)) * (rightPad - leftPad);
        const tilt = (Math.random() * 0.14 - 0.07) * w;
        const amp = 0.7 + Math.random() * 1.25;

        const pts = [];
        for (let i = 0; i < cfg.points; i += 1) {
          const y = (i / (cfg.points - 1)) * h;
          const t = i / (cfg.points - 1);
          const s1 = Math.sin(t * Math.PI * 2.0 + s * 0.35);
          const s2 = Math.sin(t * Math.PI * 4.0 + s * 0.18) * 0.45;
          const baseWiggle = (s1 + s2) * cfg.curve * 10 * amp;
          const x0 = xBase + tilt * (t - 0.5) + baseWiggle;

          pts.push({ x0, x: x0, vx: 0, y, amp, phase: Math.random() * Math.PI * 2 });
        }

        const path = make("path") as SVGPathElement;
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "url(#orgGrad)");
        path.setAttribute("stroke-width", (0.9 + Math.random() * 0.9).toFixed(2));
        path.setAttribute("opacity", (0.18 + Math.random() * 0.2).toFixed(2));
        path.setAttribute("filter", "url(#orgGlow)");
        svg.appendChild(path);

        const nodesG = make("g") as SVGGElement;
        nodesG.setAttribute("opacity", "0.7");
        svg.appendChild(nodesG);

        const nodes = [];
        const step = 6;
        for (let i = 0; i < cfg.points; i += step) {
          const c = make("circle") as SVGCircleElement;
          c.setAttribute("r", "12");
          c.setAttribute("fill", "url(#orgNode)");
          c.setAttribute("filter", "url(#orgGlow)");
          nodesG.appendChild(c);
          nodes.push({ i, el: c, seed: Math.random() * Math.PI * 2 });
        }

        state.strings.push({ pts, path, nodes });
      }

      for (const st of state.strings) {
        st.path.setAttribute("d", pathFromPoints(st.pts));
      }
    };

    const onMove = (e: MouseEvent) => {
      rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      state.mouse.vx = x - state.mouse.px;
      state.mouse.vy = y - state.mouse.py;
      state.mouse.px = x;
      state.mouse.py = y;
      state.mouse.x = x;
      state.mouse.y = y;
    };

    const onLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
      state.mouse.vx = 0;
      state.mouse.vy = 0;
    };

    const tick = () => {
      state.t += 0.016;

      const mx = state.mouse.x;
      const my = state.mouse.y;
      const mv = Math.hypot(state.mouse.vx, state.mouse.vy);
      const kick = Math.min(1.8, 0.55 + mv / 26);

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
            p.vx += dir * influence * cfg.impulse * kick * 0.03;

            if (pts[i - 1]) pts[i - 1].vx += dir * influence * cfg.impulse * kick * 0.012;
            if (pts[i + 1]) pts[i + 1].vx += dir * influence * cfg.impulse * kick * 0.012;
          }
        }

        for (let i = 1; i < pts.length - 1; i += 1) {
          const p = pts[i];
          const breathe = Math.sin(state.t * 0.9 + p.phase + i * 0.12) * cfg.drift * 2.2 * p.amp;
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

        for (const n of st.nodes) {
          const p = pts[n.i];
          const breathe = 0.55 + 0.45 * Math.sin(state.t * 1.3 + n.seed);
          const dist = Math.hypot(p.x - mx, p.y - my);
          const pop = dist < 160 ? 1 - dist / 160 : 0;

          n.el.setAttribute("cx", p.x.toFixed(1));
          n.el.setAttribute("cy", p.y.toFixed(1));
          n.el.setAttribute("opacity", (0.12 + breathe * 0.22 + pop * 0.32).toFixed(3));
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rebuild();

    if (!reduced) rafId = requestAnimationFrame(tick);

    window.addEventListener("resize", rebuild, { passive: true });
    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", rebuild);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
        <div className="skillsV2" ref={skillsRef}>
          <svg className="skillsV2__bg" ref={skillsSvgRef} aria-hidden="true"></svg>

          <div className="skillsV2__inner content-section">
            <header className="skillsV2__header">
              <p className="skillsV2__kicker">
                <span className="dot" aria-hidden="true"></span>
                Skills
              </p>
              <h2 className="content-section__title skillsV2__title">Навыки и сильные стороны</h2>
            </header>

            <div className="skillsV2__layout prose content-section__body">
              <div className="skillsV2__story">
                <p>
                  Я fullstack‑разработчик с фокусом на Python‑backend и ~2 годами коммерческого опыта в стартапной продуктовой разработке для заказчика: от первых MVP и быстрых итераций до продовых фич, которые выдерживают реальную нагрузку и остаются устойчивыми в долгосрочной перспективе. Моя сильная сторона — строить надёжную серверную часть и доводить пользовательский опыт на фронтенде до «чувства продукта», особенно когда в продукте есть AI/LLM‑функциональность (OpenAI) и важно, чтобы всё работало быстро, стабильно и предсказуемо.
                </p>
                <p>
                  С backend‑стороны уверенно проектирую и реализую REST API, продумываю контракты и валидацию, организую интеграции между сервисами, отвечаю за корректную обработку ошибок и устойчивость в нештатных ситуациях. Отдельное внимание уделяю стриминг‑ответам (WebSocket/SSE): умею делать так, чтобы интерфейс получал данные постепенно и сразу показывал ценность, а не «ждал минуту в тишине».
                </p>
                <p>
                  С frontend‑стороны участвую в разработке интерфейсов (React/Vite): собираю страницы и компоненты, аккуратно стыкуюсь с API, довожу UX до «живого» ощущения (например, отображение стриминга, состояния загрузки, ошибки, пустые состояния), чтобы пользователь чувствовал качество продукта, а не «набор экранов».
                </p>
              </div>

              <aside className="skillsV2__aside">
                <div className="skillsV2__panel">
                  <p className="skillsV2__panelTitle">Технический стек и практики</p>

                  <div className="skillsV2__stack">
                    <ul className="skillsV2__list">
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

                    <ul className="skillsV2__list">
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
                </div>

                <div className="skillsV2__meta">
                  <div className="skillsV2__panel">
                    <p className="skillsV2__panelTitle">Образование</p>
                    <ul className="skillsV2__plain">
                      <li>СПО (колледж): 09.02.07 «Информационные системы и программирование» — красный диплом</li>
                      <li>Высшее образование: в процессе (не IT‑направление)</li>
                    </ul>
                  </div>

                  <div className="skillsV2__panel">
                    <p className="skillsV2__panelTitle">Языки</p>
                    <ul className="skillsV2__plain">
                      <li>Русский — родной</li>
                      <li>Английский — B1</li>
                    </ul>
                  </div>
                </div>
              </aside>
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
