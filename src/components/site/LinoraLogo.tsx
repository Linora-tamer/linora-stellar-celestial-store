import React from "react";

interface LinoraLogoProps {
  variant?: "seal" | "wordmark" | "combo" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

export function LinoraLogo({
  variant = "combo",
  size = "md",
  className = "",
  showTagline = true,
}: LinoraLogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: "text-sm", seal: 40 },
    md: { icon: 34, text: "text-lg", seal: 52 },
    lg: { icon: 44, text: "text-2xl", seal: 72 },
    xl: { icon: 60, text: "text-3xl", seal: 96 },
  };

  const dim = sizeMap[size];

  // 1. Pure Icon / Crest
  if (variant === "icon") {
    return (
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-500 hover:rotate-6 ${className}`}
        aria-label="Linora Stellar Star Crest"
      >
        <defs>
          <linearGradient id="linoraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1D6" />
            <stop offset="40%" stopColor="#E2B176" />
            <stop offset="70%" stopColor="#C48E4E" />
            <stop offset="100%" stopColor="#8E5E2A" />
          </linearGradient>
          <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit ellipse */}
        <ellipse
          cx="50"
          cy="42"
          rx="38"
          ry="15"
          transform="rotate(-22 50 42)"
          stroke="url(#linoraGoldGrad)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />

        {/* Central radiant 4-pointed star */}
        <g filter="url(#starGlow)">
          <path
            d="M50 14 C50 32 38 42 16 42 C38 42 50 52 50 70 C50 52 62 42 84 42 C62 42 50 32 50 14 Z"
            fill="url(#linoraGoldGrad)"
          />
        </g>

        {/* Core sparkle diamond */}
        <circle cx="50" cy="42" r="2.5" fill="#FFFFFF" />

        {/* Surrounding mini stars */}
        <circle cx="28" cy="22" r="1.5" fill="#FFE5BA" opacity="0.9" />
        <circle cx="76" cy="26" r="1.8" fill="#FFE5BA" opacity="0.9" />
        <circle cx="68" cy="62" r="1.4" fill="#FFE5BA" opacity="0.85" />
        <circle cx="34" cy="60" r="1.2" fill="#FFE5BA" opacity="0.75" />
      </svg>
    );
  }

  // 2. Circular Seal Medallion (Direct match to Image 1: 1001025116.png)
  if (variant === "seal") {
    return (
      <svg
        width={dim.seal}
        height={dim.seal}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-md ${className}`}
        aria-label="Linora Stellar Circular Brand Seal"
      >
        <defs>
          <linearGradient id="sealGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="35%" stopColor="#DFAD71" />
            <stop offset="70%" stopColor="#B68040" />
            <stop offset="100%" stopColor="#E5B980" />
          </linearGradient>
          <radialGradient id="sealNightSky" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#14213d" />
            <stop offset="65%" stopColor="#0a0f1d" />
            <stop offset="100%" stopColor="#04060b" />
          </radialGradient>
          <filter id="sealGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Navy Medallion Background */}
        <circle cx="100" cy="100" r="96" fill="url(#sealNightSky)" />

        {/* Outer and Inner Gold Rings */}
        <circle
          cx="100"
          cy="100"
          r="95"
          stroke="url(#sealGoldBorder)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="url(#sealGoldBorder)"
          strokeWidth="0.8"
          opacity="0.6"
          fill="none"
        />

        {/* Nebula dust / subtle star specks */}
        <circle cx="45" cy="50" r="1.5" fill="#FFEBBF" opacity="0.8" />
        <circle cx="155" cy="45" r="1.5" fill="#FFEBBF" opacity="0.8" />
        <circle cx="160" cy="120" r="1.2" fill="#FFEBBF" opacity="0.7" />
        <circle cx="40" cy="130" r="1.2" fill="#FFEBBF" opacity="0.7" />
        <circle cx="100" cy="25" r="1.4" fill="#FFFFFF" opacity="0.9" />

        {/* Orbital Ring angled */}
        <ellipse
          cx="100"
          cy="68"
          rx="52"
          ry="19"
          transform="rotate(-20 100 68)"
          stroke="url(#sealGoldBorder)"
          strokeWidth="2.4"
          fill="none"
          opacity="0.9"
        />

        {/* Central 4-pointed Radiant Star */}
        <g filter="url(#sealGlow)">
          <path
            d="M100 32 C100 55 86 68 60 68 C86 68 100 81 100 104 C100 81 114 68 140 68 C114 68 100 55 100 32 Z"
            fill="url(#sealGoldBorder)"
          />
        </g>
        <circle cx="100" cy="68" r="2.8" fill="#FFFFFF" />

        {/* Brand Name Text: LINORA */}
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fill="url(#sealGoldBorder)"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="24"
          fontWeight="600"
          letterSpacing="4"
        >
          LINORA
        </text>

        {/* Star rule under LINORA */}
        <line
          x1="48"
          y1="135"
          x2="82"
          y2="135"
          stroke="url(#sealGoldBorder)"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <circle cx="100" cy="135" r="1.5" fill="url(#sealGoldBorder)" />
        <line
          x1="118"
          y1="135"
          x2="152"
          y2="135"
          stroke="url(#sealGoldBorder)"
          strokeWidth="0.8"
          opacity="0.7"
        />

        {/* STELLAR */}
        <text
          x="100"
          y="148"
          textAnchor="middle"
          fill="url(#sealGoldBorder)"
          fontFamily="'Jost', system-ui, sans-serif"
          fontSize="9"
          fontWeight="500"
          letterSpacing="5"
          opacity="0.95"
        >
          STELLAR
        </text>

        {/* DIGITAL & PAPER GOODS */}
        <text
          x="100"
          y="164"
          textAnchor="middle"
          fill="url(#sealGoldBorder)"
          fontFamily="'Jost', system-ui, sans-serif"
          fontSize="7"
          fontWeight="400"
          letterSpacing="3"
          opacity="0.8"
        >
          DIGITAL &amp; PAPER GOODS
        </text>
      </svg>
    );
  }

  // 3. Wordmark (Direct match to Image 3: 1001025106.png)
  if (variant === "wordmark") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        {/* Main Wordmark with star above the 'I' */}
        <div className="relative flex items-center tracking-[0.25em] font-display font-semibold text-text-primary">
          <span className="text-xl sm:text-2xl lg:text-3xl text-gradient-gold">L</span>

          {/* Letter I with custom four-pointed star crown */}
          <div className="relative inline-flex flex-col items-center px-0.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute -top-3 text-accent animate-pulse"
            >
              <path
                d="M12 0 C12 7.5 7.5 12 0 12 C7.5 12 12 16.5 12 24 C12 16.5 16.5 12 24 12 C16.5 12 12 7.5 12 0 Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-xl sm:text-2xl lg:text-3xl text-gradient-gold">I</span>
          </div>

          <span className="text-xl sm:text-2xl lg:text-3xl text-gradient-gold">NORA</span>
        </div>

        {/* Subtitle Rule: DIGITAL & PAPER GOODS */}
        <div className="mt-0.5 flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-accent/80 font-sans">
          <span className="h-px w-5 bg-gradient-to-r from-transparent to-accent/60" />
          <span>Digital &amp; Paper Goods</span>
          <span className="h-px w-5 bg-gradient-to-l from-transparent to-accent/60" />
        </div>

        {showTagline && (
          <span className="mt-0.5 font-display italic text-[11px] text-text-secondary/90 tracking-wider">
            Small details, big dreams
          </span>
        )}
      </div>
    );
  }

  // 4. Combo Variant (Emblem + Wordmark for Header & Footer)
  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Emblem Seal */}
      <div className="relative flex items-center justify-center">
        <LinoraLogo variant="icon" size={size} />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display font-semibold tracking-[0.2em] uppercase text-text-primary text-base sm:text-lg lg:text-xl group-hover:text-accent transition-colors">
            Linora
          </span>
          <span className="font-display tracking-[0.18em] uppercase text-accent text-sm sm:text-base">
            Stellar
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.22em] text-text-secondary">
          <span>Digital &amp; Paper Goods</span>
        </div>
      </div>
    </div>
  );
}
