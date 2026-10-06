import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

interface StarParticle {
  x: number;
  y: number;
  baseY: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  speedMultiplier: number;
  vx: number;
  vy: number;
}

interface StardustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  hasSparkle: boolean;
}

interface CursorTrailPoint {
  x: number;
  y: number;
  alpha: number;
  radius: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export function CelestialAtmosphere() {
  const { period, config } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render twinkling stars, drifting cosmic nebulae, meteors, and enchanted star trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse tracking & Cosmic Star Trail
    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    const trail: CursorTrailPoint[] = [];
    const stardust: StardustSpark[] = [];
    const shootingStars: ShootingStar[] = [];

    // Helper to spawn sparkling stardust particles
    const spawnStardust = (x: number, y: number, count = 3, burst = false) => {
      const colors = [
        config.accent,
        "#FFF7ED",
        "#E3C280",
        "#F5D485",
        "#FFFFFF",
        "rgba(255, 235, 185, 0.95)",
      ];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? Math.random() * 3.8 + 1.2 : Math.random() * 2.2 + 0.5;
        stardust.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 0.6 : 0.25),
          size: Math.random() * 2.6 + 0.9,
          alpha: 1,
          decay: burst ? Math.random() * 0.02 + 0.012 : Math.random() * 0.028 + 0.016,
          color: colors[Math.floor(Math.random() * colors.length)] ?? "#E3C280",
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.12,
          hasSparkle: Math.random() > 0.3,
        });
      }
      if (stardust.length > 120) {
        stardust.splice(0, stardust.length - 120);
      }
    };

    const addTrailPoint = (x: number, y: number) => {
      const dx = lastMouseX === -1000 ? 0 : x - lastMouseX;
      const dy = lastMouseY === -1000 ? 0 : y - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      trail.push({
        x,
        y,
        alpha: 0.85,
        radius: Math.min(18, Math.max(5, speed * 0.45 + 4)),
        speed,
      });

      if (trail.length > 32) {
        trail.shift();
      }

      lastMouseX = x;
      lastMouseY = y;

      // Spawn diamond stardust particles along cursor motion
      const sparkCount = speed > 15 ? 4 : speed > 4 ? 2 : 1;
      spawnStardust(x, y, sparkCount, false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      addTrailPoint(mouseX, mouseY);
    };

    // Touch support for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          mouseX = touch.clientX;
          mouseY = touch.clientY;
          addTrailPoint(mouseX, mouseY);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          mouseX = touch.clientX;
          mouseY = touch.clientY;
          spawnStardust(mouseX, mouseY, 16, true);
        }
      }
    };

    // Click burst effect: burst of 18 sparkling diamond cosmic particles
    const handleClick = (e: MouseEvent) => {
      spawnStardust(e.clientX, e.clientY, 18, true);
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      lastMouseX = -1000;
      lastMouseY = -1000;
    };

    // Parallax scroll tracking
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Number of stars & cosmic particles scales with the celestial period
    const targetStarCount = Math.max(25, Math.round(config.starsOpacity * 175));

    const stars: StarParticle[] = [];
    for (let i = 0; i < targetStarCount; i++) {
      const yPos = Math.random() * height;
      stars.push({
        x: Math.random() * width,
        y: yPos,
        baseY: yPos,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        speedMultiplier: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      });
    }

    // Helper to spawn shooting stars (meteors)
    const maybeSpawnShootingStar = () => {
      // Spawn probability roughly every 4 to 8 seconds
      if (Math.random() < 0.007 && shootingStars.length < 2) {
        const startX = Math.random() * (width * 0.8) + width * 0.1;
        const startY = Math.random() * (height * 0.4);
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4; // roughly 45 degrees diagonal
        const speed = Math.random() * 8 + 9;
        shootingStars.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          len: Math.random() * 80 + 70,
          size: Math.random() * 1.8 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          color: config.accent,
        });
      }
    };

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Periodically trigger shooting stars
      maybeSpawnShootingStar();

      // 1. Draw Shooting Stars / Meteors
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        if (!m) continue;
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, m.alpha);
        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - (m.vx / 10) * m.len,
          m.y - (m.vy / 10) * m.len,
        );
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.2, m.color);
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - (m.vx / 10) * m.len, m.y - (m.vy / 10) * m.len);
        ctx.stroke();

        // Glowing star head
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 2. Draw Luminous Star Trail Ribbon (connecting cursor points)
      if (trail.length > 2) {
        ctx.save();
        for (let i = 1; i < trail.length; i++) {
          const p1 = trail[i - 1];
          const p2 = trail[i];
          if (!p1 || !p2) continue;
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const progress = i / trail.length;
          const alpha = p2.alpha * progress * 0.6;

          if (alpha > 0.02) {
            ctx.strokeStyle = config.accent;
            ctx.lineWidth = Math.max(1, p2.radius * 0.4 * progress);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalAlpha = alpha;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 3. Draw glowing cursor aura points
      if (trail.length > 0) {
        for (let i = 0; i < trail.length; i++) {
          const pt = trail[i];
          if (!pt) continue;
          pt.alpha *= 0.91;
          if (pt.alpha > 0.02) {
            ctx.save();
            const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius * 2.8);
            grad.addColorStop(0, config.accent);
            grad.addColorStop(0.45, "rgba(227, 194, 128, 0.4)");
            grad.addColorStop(1, "transparent");
            ctx.globalAlpha = pt.alpha * 0.45;
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius * 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 4. Draw sparkling cosmic cursor trail (stardust diamond sparks)
      for (let i = stardust.length - 1; i >= 0; i--) {
        const spark = stardust[i];
        if (!spark) continue;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.rotation += spark.rotSpeed;
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0) {
          stardust.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.rotate(spark.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, spark.alpha));
        ctx.fillStyle = spark.color;

        // Draw diamond spark
        ctx.beginPath();
        ctx.moveTo(0, -spark.size * 1.5);
        ctx.lineTo(spark.size, 0);
        ctx.lineTo(0, spark.size * 1.5);
        ctx.lineTo(-spark.size, 0);
        ctx.closePath();
        ctx.fill();

        // 4-pointed micro sparkle star
        if (spark.hasSparkle && spark.alpha > 0.25) {
          ctx.strokeStyle = spark.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(-spark.size * 2.4, 0);
          ctx.lineTo(spark.size * 2.4, 0);
          ctx.moveTo(0, -spark.size * 2.4);
          ctx.lineTo(0, spark.size * 2.4);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Draw stars & cosmic background particles with parallax scroll + mouse reaction
      ctx.fillStyle = config.accent;
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const parallaxY = (star.y - ((scrollY * star.speedMultiplier) % height) + height) % height;

        // Subtle reaction to cursor (gentle deflection)
        const dx = star.x - mouseX;
        const dy = parallaxY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let renderX = star.x;
        let renderY = parallaxY;

        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130;
          renderX += (dx / dist) * force * 16;
          renderY += (dy / dist) * force * 16;
        }

        const currentOpacity =
          (Math.sin(frame * star.twinkleSpeed + star.twinklePhase) * 0.4 + 0.6) *
          star.opacity *
          Math.max(0.08, config.starsOpacity);

        ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-pointed sparkle on brighter celestial particles
        if (star.size > 1.5 && currentOpacity > 0.38) {
          ctx.strokeStyle = config.accent;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(renderX - 3.8, renderY);
          ctx.lineTo(renderX + 3.8, renderY);
          ctx.moveTo(renderX, renderY - 3.8);
          ctx.lineTo(renderX, renderY + 3.8);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [config.starsOpacity, config.accent]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-1000"
      aria-hidden="true"
      suppressHydrationWarning
    >
      {/* 1. Dynamic Sky Base Gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: "var(--bg-gradient, " + config.skyGradient + ")",
          opacity: 0.9,
        }}
        suppressHydrationWarning
      />

      {/* 2. ✨ ORGANIC NEBULA BACKGROUND EFFECT — Layer 1 (Drifting Deep Celestial Cloud) */}
      <div
        className="absolute -top-[15%] -right-[10%] h-[70vw] w-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[90px] animate-nebula-slow opacity-60 transition-all duration-1000"
        style={{
          background:
            period === "dawn" || period === "sunrise"
              ? "radial-gradient(circle, rgba(230, 190, 210, 0.45) 0%, rgba(217, 160, 140, 0.25) 45%, transparent 75%)"
              : period === "daylight" ||
                  period === "morning" ||
                  period === "forenoon" ||
                  period === "noon" ||
                  period === "afternoon"
                ? "radial-gradient(circle, rgba(190, 215, 235, 0.4) 0%, rgba(197, 160, 89, 0.2) 45%, transparent 75%)"
                : period === "sunset" ||
                    period === "dusk" ||
                    period === "twilight" ||
                    period === "evening"
                  ? "radial-gradient(circle, rgba(140, 50, 110, 0.45) 0%, rgba(242, 201, 76, 0.25) 45%, transparent 75%)"
                  : /* midnight & night */
                    "radial-gradient(circle, rgba(34, 49, 93, 0.55) 0%, rgba(227, 194, 128, 0.2) 40%, transparent 75%)",
        }}
        suppressHydrationWarning
      />

      {/* 3. ✨ ORGANIC NEBULA BACKGROUND EFFECT — Layer 2 (Warm Golden Starlight Dust Cloud) */}
      <div
        className="absolute top-[40%] -left-[10%] h-[60vw] w-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] animate-nebula-reverse opacity-50 transition-all duration-1000"
        style={{
          background:
            period === "dawn" || period === "sunrise"
              ? "radial-gradient(circle, rgba(245, 234, 236, 0.5) 0%, rgba(227, 194, 128, 0.2) 50%, transparent 75%)"
              : period === "daylight" ||
                  period === "morning" ||
                  period === "forenoon" ||
                  period === "noon" ||
                  period === "afternoon"
                ? "radial-gradient(circle, rgba(250, 246, 240, 0.5) 0%, rgba(184, 147, 67, 0.2) 50%, transparent 75%)"
                : period === "sunset" ||
                    period === "dusk" ||
                    period === "twilight" ||
                    period === "evening"
                  ? "radial-gradient(circle, rgba(74, 40, 64, 0.5) 0%, rgba(227, 194, 128, 0.22) 50%, transparent 75%)"
                  : /* midnight & night */
                    "radial-gradient(circle, rgba(227, 194, 128, 0.16) 0%, rgba(16, 25, 42, 0.35) 50%, transparent 75%)",
        }}
        suppressHydrationWarning
      />

      {/* 4. Atmospheric Horizon Glow & Celestial Highlights */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            period === "dawn" || period === "sunrise"
              ? "radial-gradient(ellipse 90% 50% at 50% 100%, rgba(227, 194, 128, 0.28) 0%, rgba(235, 229, 242, 0.4) 45%, transparent 80%)"
              : period === "daylight" ||
                  period === "morning" ||
                  period === "forenoon" ||
                  period === "noon" ||
                  period === "afternoon"
                ? "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(197, 160, 89, 0.2) 0%, rgba(234, 242, 248, 0.35) 50%, transparent 75%)"
                : period === "sunset" ||
                    period === "dusk" ||
                    period === "twilight" ||
                    period === "evening"
                  ? "radial-gradient(ellipse 95% 55% at 50% 100%, rgba(227, 194, 128, 0.32) 0%, rgba(74, 40, 64, 0.35) 50%, transparent 85%)"
                  : /* midnight & night */
                    "radial-gradient(circle 500px at 75% 20%, rgba(227, 194, 128, 0.15) 0%, rgba(16, 25, 42, 0.3) 40%, transparent 80%)",
        }}
        suppressHydrationWarning
      />

      {/* 5. Moon / Celestial Aura */}
      {(period === "midnight" ||
        period === "night" ||
        period === "sunset" ||
        period === "evening") && (
        <div className="absolute right-[8%] top-[10%] h-64 w-64 rounded-full bg-accent/15 blur-3xl transition-opacity duration-1000 animate-glow-pulse" />
      )}

      {/* 6. Interactive HTML5 Canvas Starfield + Cosmic Cursor Trail */}
      <canvas
        ref={canvasRef}
        id="starfield"
        className="absolute inset-0 block h-full w-full pointer-events-none"
      />
    </div>
  );
}
