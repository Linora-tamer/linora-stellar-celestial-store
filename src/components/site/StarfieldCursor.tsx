import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface StardustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  points?: number;
  rotation?: number;
  rotSpeed?: number;
}

const STORAGE_KEY = "linora_star_cursor_active";

export function StarfieldCursor() {
  const [enabled, setEnabled] = useState(false);
  const [userToggled, setUserToggled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== "false";
    } catch {
      return true;
    }
  });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const starRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Listen to custom toggle events from UI
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      setUserToggled(customEvent.detail.active);
    };
    window.addEventListener("linora-star-cursor-toggle", handleToggle);
    return () => {
      window.removeEventListener("linora-star-cursor-toggle", handleToggle);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion || !userToggled) {
      setEnabled(false);
      document.body.classList.remove("has-star-cursor");
      return;
    }

    setEnabled(true);
    document.body.classList.add("has-star-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let haloX = -100;
    let haloY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let animId: number;

    const sparks: StardustSpark[] = [];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest(
          "a, button, input, textarea, select, [role='button'], .clickable, .card-star, [tabindex]",
        );
        setIsHovering(Boolean(clickable));
      }

      // Calculate speed
      const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      // Spawn glowing star-field stardust along path
      if (dist > 3 && Math.random() > 0.3) {
        sparks.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 + 0.2,
          size: Math.random() * 2.8 + 0.8,
          alpha: 0.95,
          decay: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.35 ? "#E3C280" : "#FFF8ED",
          points: Math.random() > 0.5 ? 4 : 0,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        });

        if (sparks.length > 55) sparks.shift();
      }
    };

    const onMouseDown = () => {
      setIsClicking(true);
      // Spawn cosmic stardust burst of 10 radiant particles
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
        const spd = Math.random() * 3.2 + 1.5;
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 3.2 + 1.2,
          alpha: 1,
          decay: 0.038,
          color: i % 2 === 0 ? "#E3C280" : "#FFFFFF",
          points: 4,
          rotation: Math.random() * Math.PI,
          rotSpeed: 0.12,
        });
      }
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // Helper: draw 4-pointed micro diamond star
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      sp: number,
      r: number,
      angle: number,
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(angle);
      c.beginPath();
      for (let i = 0; i < sp * 2; i++) {
        const rad = i % 2 === 0 ? r : r * 0.35;
        const a = (i * Math.PI) / sp;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Render loop with smooth spring damping
    const render = () => {
      // Smooth halo trailing
      haloX += (mouseX - haloX) * 0.2;
      haloY += (mouseY - haloY) * 0.2;

      if (starRef.current) {
        starRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${haloX}px, ${haloY}px, 0)`;
      }

      // Draw stardust particles on canvas
      if (ctx && canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          if (!sp) continue;
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.decay;
          if (sp.rotation !== undefined && sp.rotSpeed) {
            sp.rotation += sp.rotSpeed;
          }

          if (sp.alpha <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.fillStyle = sp.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = sp.color;

          if (sp.points && sp.points > 0) {
            drawStar(ctx, sp.x, sp.y, sp.points, sp.size * 1.4, sp.rotation || 0);
          } else {
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      document.body.classList.remove("has-star-cursor");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [userToggled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Micro-stardust canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Trailing Celestial Halo Ring */}
      <div
        ref={haloRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovering
              ? "h-11 w-11 border-accent/70 bg-accent/15 shadow-[0_0_24px_rgba(227,194,128,0.55)] scale-110"
              : isClicking
                ? "h-5 w-5 border-accent bg-accent/40 scale-75"
                : "h-7 w-7 border-accent/40 bg-accent/5 shadow-[0_0_12px_rgba(227,194,128,0.25)]"
          }`}
        />
      </div>

      {/* Primary 4-Pointed Celestial Gold Star Cursor */}
      <div
        ref={starRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
      >
        <div
          className={`relative flex items-center justify-center transition-transform duration-150 ${
            isHovering ? "scale-125 rotate-45" : isClicking ? "scale-75" : "scale-100"
          }`}
        >
          {/* Central brilliant white/gold star core */}
          <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#E3C280]" />

          {/* 4-Pointed Star Diamond Path */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            className="absolute -inset-0.5 h-full w-full text-accent drop-shadow-[0_0_8px_rgba(227,194,128,0.9)]"
          >
            <path
              d="M11 1 L13.5 8.5 L21 11 L13.5 13.5 L11 21 L8.5 13.5 L1 11 L8.5 8.5 Z"
              fill="currentColor"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive toggle button for the Star Cursor (can be placed in header / TimeControlBar)
 */
export function StarCursorToggle({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "false") {
        setActive(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = !active;
    setActive(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent("linora-star-cursor-toggle", { detail: { active: next } }),
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={active ? "Toggle Star Cursor (Active)" : "Toggle Star Cursor (Disabled)"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
        active
          ? "border-accent/60 bg-accent/15 text-accent font-semibold shadow-xs"
          : "border-border/80 bg-surface/50 text-text-secondary hover:text-text-primary"
      } ${className}`}
    >
      <Sparkles className={`h-3 w-3 ${active ? "text-accent animate-pulse" : ""}`} />
      {showText && <span>{active ? "Star Cursor: ON" : "Star Cursor: OFF"}</span>}
    </button>
  );
}
