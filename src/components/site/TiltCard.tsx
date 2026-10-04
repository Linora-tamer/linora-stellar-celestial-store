import { useRef, type ReactNode, type HTMLAttributes } from "react";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({
  children,
  className = "",
  intensity = 10,
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / intensity
    }deg) rotateY(${x / intensity}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-surface card relative rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6 backdrop-blur-[var(--blur-strength)] transition-all duration-200 ${className}`}
      style={style}
      {...props}
    >
      <div className="tilt-glare" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
