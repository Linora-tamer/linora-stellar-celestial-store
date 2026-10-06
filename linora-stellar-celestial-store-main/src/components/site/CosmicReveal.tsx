import { useEffect, useRef, useState, type ReactNode } from "react";

interface CosmicRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: "up" | "down" | "left" | "right" | "none";
  threshold?: number;
  once?: boolean;
}

export function CosmicReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
  once = true,
}: CosmicRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === "undefined") {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Initial transform class based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translate-y-8";
      case "down":
        return "-translate-y-8";
      case "left":
        return "translate-x-8";
      case "right":
        return "-translate-x-8";
      case "none":
        return "scale-95";
      default:
        return "translate-y-8";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`cosmic-reveal-wrapper transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed
          ? "opacity-100 translate-y-0 translate-x-0 scale-100 blur-none cosmic-shimmer-active"
          : `opacity-0 ${getInitialTransform()} blur-[3px] pointer-events-none`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Global hook to auto-reveal any `.cosmic-reveal` element on scroll
 */
export function useAutoCosmicScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cosmic-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    const elements = document.querySelectorAll(".cosmic-reveal:not(.cosmic-revealed)");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}
