import React from 'react';

interface AnimatedCharacterProps {
  variant: 'mascot-drop' | 'stride-courier' | 'wave-vip';
  className?: string;
  accentColor?: string;
}

/**
 * Lightweight, tasteful animated SVG sneaker mascot characters.
 * Respects prefers-reduced-motion automatically via CSS classes in index.css.
 */
export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  variant,
  className = '',
  accentColor = '#2563EB',
}) => {
  if (variant === 'stride-courier') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        aria-hidden="true"
        title="ALTURA Express Stride Mascot"
      >
        <svg
          viewBox="0 0 120 80"
          className="w-20 h-14 animate-stride overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed motion lines */}
          <line x1="4" y1="34" x2="20" y2="34" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
          <line x1="0" y1="46" x2="16" y2="46" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="56" x2="22" y2="56" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

          {/* Animated little legs */}
          <path d="M52 60 L44 73 L36 71" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M78 60 L88 72 L95 67" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Triple-stacked chunky high sole */}
          <rect x="28" y="48" width="76" height="13" rx="6.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          <path d="M30 54 H102" stroke={accentColor} strokeWidth="2.5" />
          {/* Outsole lugs */}
          <rect x="34" y="60" width="8" height="4" rx="1.5" fill="#18181B" />
          <rect x="50" y="60" width="8" height="4" rx="1.5" fill="#18181B" />
          <rect x="66" y="60" width="8" height="4" rx="1.5" fill="#18181B" />
          <rect x="82" y="60" width="8" height="4" rx="1.5" fill="#18181B" />

          {/* Sneaker upper */}
          <path
            d="M32 48 L36 22 C36 18 42 16 48 20 L66 30 L92 34 C100 35 104 41 104 48 Z"
            fill={accentColor}
            stroke="#18181B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Character expressive eyes */}
          <circle cx="76" cy="39" r="3.5" fill="#FFFFFF" />
          <circle cx="77" cy="39" r="1.7" fill="#18181B" />
          <circle cx="88" cy="40" r="3.5" fill="#FFFFFF" />
          <circle cx="89" cy="40" r="1.7" fill="#18181B" />
        </svg>
      </div>
    );
  }

  if (variant === 'wave-vip') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        aria-hidden="true"
        title="ALTURA Drop Club Mascot"
      >
        <svg
          viewBox="0 0 120 100"
          className="w-24 h-20 animate-float-slow overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Waving arm left */}
          <path
            d="M28 46 C14 38 12 22 22 16"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="22" cy="15" r="4" fill={accentColor} stroke="#FFFFFF" strokeWidth="2" />

          {/* Guided arrow arm right */}
          <path
            d="M94 48 C106 46 112 52 114 60"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sculpted 3-tier platform base */}
          <rect x="22" y="62" width="76" height="18" rx="9" fill="#F8FAFC" stroke="#18181B" strokeWidth="2.5" />
          <path d="M25 70 H95" stroke={accentColor} strokeWidth="3" />
          <path d="M28 76 H92" stroke="#18181B" strokeWidth="2" strokeDasharray="6 4" />

          {/* Upper sneaker body */}
          <path
            d="M26 62 L32 30 C33 25 40 24 46 29 L62 40 L88 43 C96 44 98 52 98 62 Z"
            fill={accentColor}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Friendly eyes & smile */}
          <circle cx="58" cy="49" r="4" fill="#FFFFFF" />
          <circle cx="59" cy="49" r="2" fill="#18181B" />
          <circle cx="74" cy="49" r="4" fill="#FFFFFF" />
          <circle cx="75" cy="49" r="2" fill="#18181B" />
          <path d="M62 56 Q66 60 71 56" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />

          {/* Crown / Elevation spark */}
          <path d="M40 16 L44 22 L50 14 L54 22 L60 16" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // Default: 'mascot-drop'
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
      title="ALTURA Sole Architect Character"
    >
      <svg
        viewBox="0 0 110 90"
        className="w-20 h-16 animate-float-slow overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Architectural elevation shadow */}
        <ellipse cx="55" cy="82" rx="34" ry="5" fill="rgba(24,24,27,0.14)" />

        {/* Winged kinetic tab */}
        <path
          d="M20 34 L10 24 L26 26 Z"
          fill="#EA580C"
          stroke="#18181B"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* High-sole triple stack */}
        <rect x="18" y="50" width="74" height="20" rx="10" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        <path d="M20 58 H90" stroke={accentColor} strokeWidth="3" />
        <path d="M22 64 H88" stroke="#EA580C" strokeWidth="2.5" />

        {/* Upper silhouette */}
        <path
          d="M22 50 L28 24 C30 19 37 19 42 24 L58 35 L82 38 C90 39 92 44 92 50 Z"
          fill="#18181B"
          stroke="#18181B"
          strokeWidth="2.5"
        />

        {/* Visor eyes */}
        <rect x="52" y="38" width="26" height="8" rx="4" fill={accentColor} />
        <circle cx="60" cy="42" r="2" fill="#FFFFFF" />
        <circle cx="71" cy="42" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
