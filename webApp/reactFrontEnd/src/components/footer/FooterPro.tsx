import { useCallback, useEffect, useRef, useState } from "react";
import { PIcon } from "@/components/icons/PIcon";
import "./FooterPro.scss";

const EMAIL = "dreminaleksandr06@gmail.com";

export function FooterPro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const hasAnimatedBrand = useRef(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailClick = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }).catch(() => {});
    // mailto откроет приложение, если оно есть; если нет — адрес уже в буфере
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;

    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };
    const dots: Array<{ x: number; y: number; r: number; vx: number; vy: number; a: number; s: number }> = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.floor(parent.clientWidth);
      h = Math.floor(parent.clientHeight);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots.length = 0;
      const count = Math.max(12, Math.round((w * h) / 28000));
      for (let i = 0; i < count; i += 1) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.9 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          a: 0.18 + Math.random() * 0.24,
          s: 0.6 + Math.random() * 1.0,
        });
      }
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      mouse.vx = x - mouse.px;
      mouse.vy = y - mouse.py;
      mouse.px = x;
      mouse.py = y;
      mouse.x = x;
      mouse.y = y;
    };

    const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY);
    };
    const onTouchEnd = onPointerLeave;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      const g1 = ctx.createRadialGradient(w * 0.15, h * 0.25, 0, w * 0.15, h * 0.25, Math.max(w, h) * 0.8);
      g1.addColorStop(0, "rgba(103,232,249,0.09)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.85, h * 0.6, 0, w * 0.85, h * 0.6, Math.max(w, h) * 0.9);
      g2.addColorStop(0, "rgba(165,140,255,0.08)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const mx = mouse.x;
      const my = mouse.y;
      const m = Math.min(1.6, 0.6 + Math.hypot(mouse.vx, mouse.vy) / 24);

      for (const d of dots) {
        d.x += d.vx * d.s;
        d.y += d.vy * d.s;

        if (d.x < -20) d.x = w + 20;
        if (d.x > w + 20) d.x = -20;
        if (d.y < -20) d.y = h + 20;
        if (d.y > h + 20) d.y = -20;

        if (mx > -1000) {
          const dx = d.x - mx;
          const dy = d.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            const t = 1 - dist / 160;
            d.x += (dx / (dist + 0.001)) * t * 0.22 * m;
            d.y += (dy / (dist + 0.001)) * t * 0.12 * m;
          }
        }

        const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 8);
        glow.addColorStop(0, `rgba(255,255,255,${d.a})`);
        glow.addColorStop(0.35, `rgba(103,232,249,${d.a * 0.55})`);
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();

    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: true });

    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Появление блока имени: иконка → текст одним блоком (fade)
  useEffect(() => {
    const root = brandRef.current;
    if (!root || hasAnimatedBrand.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mark = root.querySelector<HTMLElement>(".footerPro__mark");
    const textBlock = root.querySelector<HTMLElement>(".footerPro__brandText");
    const easeOut = "cubic-bezier(0.33, 1, 0.68, 1)";

    const runTimeline = () => {
      hasAnimatedBrand.current = true;

      mark?.animate([{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "scale(1)" }], {
        duration: 450,
        easing: easeOut,
        fill: "forwards",
      });

      textBlock?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        delay: 180,
        easing: easeOut,
        fill: "forwards",
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        runTimeline();
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.2 }
    );
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footerPro" id="contacts">
      <canvas className="footerPro__fx" ref={canvasRef} aria-hidden="true" />

      <div className="footerPro__inner">
        <div className="footerPro__top">
          <div className="footerPro__brand" ref={brandRef}>
            <div className="footerPro__brandContent">
              <div className="footerPro__mark" aria-hidden="true">
                <PIcon name="person" />
              </div>
              <div className="footerPro__brandText">
                <p className="footerPro__name">Дремин Александр</p>
                <p className="footerPro__tagline">Middle Python Developer</p>
              </div>
            </div>
          </div>

          <div className="footerPro__cta">
            <a className="fBtn" href={`mailto:${EMAIL}`} onClick={handleEmailClick} title={emailCopied ? "Скопировано" : "Копировать и открыть почту"}>
              <span className="fBtn__icon" aria-hidden="true">
                <PIcon name="mail" />
              </span>
              <span className="fBtn__text">
                <span className="fBtn__label">Почта</span>
                <span className="fBtn__value">{emailCopied ? "Скопировано" : EMAIL}</span>
              </span>
              <span className="fBtn__arrow" aria-hidden="true">
                <PIcon name="arrow" />
              </span>
            </a>

            <a className="fBtn" href="https://t.me/azora929" target="_blank" rel="noopener noreferrer">
              <span className="fBtn__icon" aria-hidden="true">
                <PIcon name="telegram" />
              </span>
              <span className="fBtn__text">
                <span className="fBtn__label">Telegram</span>
                <span className="fBtn__value">t.me/azora929</span>
                <span className="fBtn__hint">@azora929</span>
              </span>
              <span className="fBtn__arrow" aria-hidden="true">
                <PIcon name="arrow" />
              </span>
            </a>
          </div>
        </div>

        <div className="footerPro__grid">
          <article className="fCard" data-accent="cyan">
            <div className="fCard__head">
              <span className="fIcon" aria-hidden="true">
                <PIcon name="bolt" />
              </span>
              <div>
                <h3 className="fCard__title">Открыт к предложениям</h3>
                <p className="fCard__desc">
                  Ищу проекты, где есть смысл, аккуратные процессы и желание делать вещи, которыми можно гордиться
                </p>
              </div>
            </div>
            <p className="fCard__text">
              Люблю, когда в работе есть понятная цель, спокойный ритм и уважение к деталям: так получается не просто
              “сделать”, а действительно довести до качества. Ценю проекты, где думают о пользователе и не теряют смысл
              на пути от идеи до результата.
            </p>
          </article>

          <article className="fCard" data-accent="violet">
            <div className="fCard__head">
              <span className="fIcon" aria-hidden="true">
                <PIcon name="shield" />
              </span>
              <div>
                <h3 className="fCard__title">Фокус</h3>
                <p className="fCard__desc">Как я работаю</p>
              </div>
            </div>
            <ul className="fList">
              <li>Держу слово и сроки, чтобы всем было спокойно</li>
              <li>Люблю, когда результат чистый, понятный и без лишнего шума</li>
              <li>Вникаю в задачу до сути, чтобы делать решение осознанно</li>
              <li>Стараюсь думать о пользователе, а не только о задачах</li>
            </ul>
          </article>

          <article className="fCard fCard--wide" data-accent="neutral">
            <div className="fCard__head">
              <span className="fIcon" aria-hidden="true">
                <PIcon name="globe" />
              </span>
              <div>
                <h3 className="fCard__title">Навигация</h3>
                <p className="fCard__desc">быстро перейти</p>
              </div>
            </div>

            <div className="fPills">
              <a className="fPill" href={`mailto:${EMAIL}`} onClick={handleEmailClick} title={emailCopied ? "Скопировано" : "Копировать и открыть почту"}>
                <span className="fPill__dot" aria-hidden="true"></span>{emailCopied ? "Скопировано" : "Email"}
              </a>
              <a className="fPill" href="https://t.me/azora929" target="_blank" rel="noopener noreferrer">
                <span className="fPill__dot" aria-hidden="true"></span>Telegram
              </a>
              <a className="fPill" href="#projects">
                <span className="fPill__dot" aria-hidden="true"></span>Проекты
              </a>
              <a className="fPill" href="#skills">
                <span className="fPill__dot" aria-hidden="true"></span>Навыки
              </a>
            </div>

            <div className="footerPro__bottom">
              <p className="footerPro__copy">© {new Date().getFullYear()} Дремин Александр</p>
              <p className="footerPro__made">Сделано с вниманием к деталям ✦</p>
            </div>
          </article>
        </div>
      </div>
    </footer>
  );
}
