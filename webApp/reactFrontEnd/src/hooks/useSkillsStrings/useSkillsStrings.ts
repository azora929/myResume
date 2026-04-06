import { useEffect } from "react";
import type { RefObject } from "react";

interface UseSkillsStringsArgs {
  rootRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
}

export function useSkillsStrings({ rootRef, svgRef }: UseSkillsStringsArgs) {
  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const make = (t: string) => document.createElementNS(NS, t);
    const supportsPointer = "PointerEvent" in window;
    /** Телефоны: облегчённый режим (без blur, меньше геометрии, реже обновление path) */
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
      /** Десктоп: blur + узлы; мобилка: без blur, реже setAttribute на path */
      usePathFilter: true,
      useNodes: true,
      /** 1 = каждый кадр; 2 = path/узлы обновлять через кадр (~30 визуальных обновлений/с) */
      renderStride: 1,
    };

    let lastScrollY = window.scrollY;
    let scrollVel = 0;

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
      if (mobile) {
        cfg.strings = 7;
        cfg.points = 16;
        cfg.usePathFilter = false;
        cfg.useNodes = true;
        cfg.nodeStep = 8;
        cfg.nodeRadius = 7;
        cfg.renderStride = 2;
        cfg.stiffness = 0.044;
        cfg.coupling = 0.095;
        cfg.damping = 0.93;
        cfg.mouseRadius = 120;
        cfg.impulse = 52;
        cfg.curve = 1.06;
        cfg.drift = 0.19;
        return;
      }
      cfg.strings = 20;
      cfg.points = 28;
      cfg.stiffness = 0.05;
      cfg.coupling = 0.12;
      cfg.damping = 0.92;
      cfg.mouseRadius = 120;
      cfg.impulse = 52;
      cfg.curve = 1.2;
      cfg.drift = 0.24;
      cfg.nodeStep = 12;
      cfg.nodeRadius = 10;
      cfg.usePathFilter = true;
      cfg.useNodes = true;
      cfg.renderStride = 1;
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

      if (cfg.usePathFilter) {
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
        defs.appendChild(glow);
      }

      if (cfg.useNodes) {
        const node = make("radialGradient");
        node.setAttribute("id", "strNode");
        node.innerHTML = `
        <stop offset="0" stop-color="rgba(255,255,255,.70)"/>
        <stop offset="0.35" stop-color="rgba(103,232,249,.26)"/>
        <stop offset="1" stop-color="rgba(103,232,249,0)"/>
      `;
        defs.appendChild(node);
      }

      defs.appendChild(grad);
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
        if (cfg.usePathFilter) path.setAttribute("filter", "url(#strGlow)");
        svg.appendChild(path);

        const nodes: Array<{ i: number; el: SVGCircleElement; seed: number }> = [];
        if (cfg.useNodes) {
          const nodesG = make("g") as SVGGElement;
          nodesG.setAttribute("opacity", "0.62");
          svg.appendChild(nodesG);
          const step = cfg.nodeStep;
          for (let i = 0; i < cfg.points; i += step) {
            const c = make("circle") as SVGCircleElement;
            c.setAttribute("r", cfg.nodeRadius.toString());
            c.setAttribute("fill", "url(#strNode)");
            if (cfg.usePathFilter) c.setAttribute("filter", "url(#strGlow)");
            nodesG.appendChild(c);
            nodes.push({ i, el: c, seed: Math.random() * Math.PI * 2 });
          }
        }

        state.strings.push({ pts, path, nodes });
      }

      for (const st of state.strings) {
        st.path.setAttribute("d", pathFromPoints(st.pts));
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (!reduced && active) {
        rafId = requestAnimationFrame(tick);
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
      if (isMobile()) return;
      updatePointer(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return;
      updatePointer(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isMobile()) return;
      if (!e.touches.length) return;
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const k = isMobile() ? 0.14 : 0.3;
      const delta = (y - lastScrollY) * k;
      scrollVel += delta;
      scrollVel = Math.max(-75, Math.min(75, scrollVel));
      lastScrollY = y;
    };

    const onLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
      state.mouse.vx = 0;
      state.mouse.vy = 0;
    };

    const tick = () => {
      if (reduced) {
        rafId = 0;
        return;
      }
      if (!active) {
        rafId = 0;
        return;
      }
      state.t += 0.016;
      state.frame += 1;

      scrollVel *= 0.92;
      const mobile = isMobile();
      const scrollK = mobile ? 0.0035 : 0.008;

      const mx = state.mouse.x;
      const my = state.mouse.y;
      const mv = Math.hypot(state.mouse.vx, state.mouse.vy);
      const kick = Math.min(1.7, 0.55 + mv / 26);
      const stride = Math.max(1, cfg.renderStride);
      const shouldDraw = state.frame % stride === 0;

      for (const st of state.strings) {
        const pts = st.pts;

        if (!mobile && mx > -1000) {
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
          p.vx += scrollVel * scrollK * (0.7 + 0.3 * Math.sin(p.phase + i * 0.15));
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

        if (shouldDraw) {
          st.path.setAttribute("d", pathFromPoints(pts));
        }

        if (shouldDraw && st.nodes.length > 0) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (reduced) {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
          return;
        }
        if (active && !rafId) {
          rafId = requestAnimationFrame(tick);
        } else if (!active && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(root);

    window.addEventListener("resize", rebuild, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
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
      window.removeEventListener("scroll", onScroll);
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
  }, [rootRef, svgRef]);
}
