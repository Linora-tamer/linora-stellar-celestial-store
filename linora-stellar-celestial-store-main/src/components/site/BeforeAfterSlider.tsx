import { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
}: BeforeAfterSliderProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7 card-star space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isAr ? "تحول الفكرة إلى واقع فلكي" : "Design Transformation Case"}</span>
          </div>
          <h4 className="font-display text-xl text-text-primary mt-1">
            {isAr ? titleAr : titleEn}
          </h4>
        </div>
        <p className="text-xs text-text-secondary max-w-xs text-end hidden sm:block">
          {isAr ? subtitleAr : subtitleEn}
        </p>
      </div>

      {/* Interactive Slider Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl border border-border bg-background cursor-ew-resize"
      >
        {/* AFTER Image (Full background) */}
        <img
          src={afterImage}
          alt="Polished final design"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt="Client initial sketch"
            className="absolute inset-0 h-full w-full object-cover max-w-none filter grayscale contrast-125"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
            }}
          />
          {/* Label Badge Left */}
          <span className="absolute start-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
            {isAr ? "مسودة الفكرة الأولية" : "Initial Client Sketch"}
          </span>
        </div>

        {/* Label Badge Right */}
        <span className="absolute end-3 top-3 rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur-md shadow-xs pointer-events-none">
          {isAr ? "التصميم الفلكي النهائي" : "Polished Linora Design"}
        </span>

        {/* Draggable Divider Line */}
        <div
          className="absolute inset-y-0 w-1 bg-accent shadow-2xl pointer-events-none"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-background shadow-xl border-2 border-white/40">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
        <span>
          {isAr ? "اسحبي المؤشر يميناً ويساراً للمقارنة" : "Drag slider left & right to compare"}
        </span>
        <span className="font-semibold text-accent">{Math.round(sliderPos)}%</span>
      </div>
    </div>
  );
}
