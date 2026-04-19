// src/components/rewards/BadgeIcon.jsx
// Apr 17-18 brief:
// - Hexagonal shield SVG: M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z
// - Rarity: Common=gray, Rare=blue, Epic=purple, Legendary=gold
// - Inner icons: Star, Lightning, Flame, Crown, Book, Moon (SVG paths, no emoji)
// - Unearned: grayscale + 50% opacity + lock overlay bottom-right
// - Earned: full color + shimmer CSS stroke-dashoffset animation
// - Sizes: sm=32px, md=64px, lg=96px

import { useState, useRef } from "react";
import { RARITY_CONFIG } from "../../mocks/badgeMock";

/* ── Inner icon paths ── */
function InnerIcon({ name, color, size }) {
  const s = size * 0.38;
  const sw = Math.max(1.2, size * 0.025);

  const icons = {
    star: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color + "33"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    lightning: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color + "33"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
      </svg>
    ),
    flame: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
        <path d="M12 2c0 0-5 5-5 11 0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-2-5-2-5 0 0-1 3-3 3s-2-3-2-3S8 10 8 12" fill={color + "33"}/>
        <circle cx="12" cy="19" r="2" fill={color}/>
      </svg>
    ),
    crown: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color + "22"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 19h20M2 19l3-8 5 5 2-10 2 10 5-5 3 8"/>
      </svg>
    ),
    book: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color + "22"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    moon: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color + "33"} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  };
  return icons[name] || icons.star;
}

/* ── Lock icon overlay ── */
function LockOverlay({ size }) {
  const ls = size * 0.22;
  return (
    <div style={{ position:"absolute", bottom: size * 0.08, right: size * 0.08,
      width: ls + 8, height: ls + 8, borderRadius: "50%",
      background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(0,0,0,0.12)",
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:"0 2px 6px rgba(0,0,0,0.12)" }}>
      <svg width={ls} height={ls} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
  );
}

const SIZES = { sm: 32, md: 64, lg: 96 };

export default function BadgeIcon({ badge, size = "md", earned = true, animated = true }) {
  const [hov, setHov] = useState(false);
  const svgRef = useRef(null);

  const px = typeof size === "number" ? size : (SIZES[size] || 64);
  const cfg = RARITY_CONFIG[badge?.rarity] || RARITY_CONFIG.common;
  const strokeColor = earned ? cfg.stroke : "#9CA3AF";
  const fillColor   = earned ? cfg.fill   : "#F3F4F6";
  const iconColor   = earned ? cfg.stroke : "#9CA3AF";

  // Shimmer dasharray for earned badges (stroke-dashoffset animation)
  const perimeter = 2 * (px * 0.5 * 6 * Math.sin(Math.PI / 6) + px * 0.5 * 6 * Math.cos(Math.PI / 6));
  const dash = Math.round(perimeter * 0.18);

  const shimmerDur = badge?.rarity === "legendary" ? "1.8s" : badge?.rarity === "epic" ? "2.2s" : "2.8s";

  return (
    <>
      <style>{`
        @keyframes biShimmer {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -${dash * 4}px; }
        }
        @keyframes biFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-${Math.max(2, px * 0.04)}px); }
        }
        @keyframes biGlowPulse {
          0%,100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.1); }
        }
        @keyframes biOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes biOrbitRev {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
      `}</style>

      <div
        style={{ position:"relative", width:px, height:px, flexShrink:0,
          filter: earned ? "none" : "grayscale(1)",
          opacity: earned ? 1 : 0.5,
          animation: earned && animated ? `biFloat ${3 + px * 0.02}s ease-in-out infinite` : "none",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Ambient glow behind */}
        {earned && (
          <div style={{ position:"absolute", inset: -px * 0.35, borderRadius:"50%", pointerEvents:"none",
            background: `radial-gradient(circle, ${cfg.glowColor} 0%, transparent 65%)`,
            animation: "biGlowPulse 2.8s ease-in-out infinite" }}/>
        )}

        {/* Outer orbit ring (legendary only) */}
        {earned && badge?.rarity === "legendary" && (
          <div style={{ position:"absolute", inset: -px*0.12, borderRadius:"50%",
            borderTop: `${Math.max(1,px*0.018)}px solid ${cfg.stroke}88`,
            borderRight: `${Math.max(1,px*0.018)}px solid ${cfg.stroke}44`,
            borderBottom: `${Math.max(1,px*0.018)}px solid transparent`,
            borderLeft: `${Math.max(1,px*0.018)}px solid transparent`,
            animation: "biOrbit 3s linear infinite" }}/>
        )}
        {earned && (badge?.rarity === "legendary" || badge?.rarity === "epic") && (
          <div style={{ position:"absolute", inset: -px*0.07, borderRadius:"50%",
            border: `${Math.max(1,px*0.014)}px dashed ${cfg.stroke}33`,
            animation: "biOrbitRev 6s linear infinite" }}/>
        )}

        {/* Main hex shield SVG */}
        <svg
          ref={svgRef}
          width={px} height={px}
          viewBox="0 0 24 24"
          style={{ display:"block", overflow:"visible",
            transform: hov && earned ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            filter: hov && earned ? `drop-shadow(0 0 ${px*0.12}px ${cfg.stroke})` : "none",
          }}
        >
          {/* Filled hex */}
          <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"
            fill={fillColor}
            stroke="none"
          />

          {/* Inner gradient fill */}
          <defs>
            <linearGradient id={`hexGrad_${badge?.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
            <linearGradient id={`strokeGrad_${badge?.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeColor}/>
              <stop offset="100%" stopColor={badge?.rarity === "legendary" ? "#fff7d6" : strokeColor + "88"}/>
            </linearGradient>
          </defs>
          <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"
            fill={`url(#hexGrad_${badge?.id})`}
          />

          {/* Hex stroke — static base */}
          <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth={earned ? (hov ? 1.2 : 0.9) : 0.8}
            strokeLinejoin="round"
          />

          {/* Shimmer stroke (earned only) */}
          {earned && animated && (
            <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeDasharray={`${dash} ${dash * 3}`}
              style={{
                animation: `biShimmer ${shimmerDur} linear infinite`,
                filter: `drop-shadow(0 0 2px ${strokeColor})`,
              }}
            />
          )}

          {/* Top shine arc */}
          <path d="M5 7.5 Q12 4.5 19 7.5" fill="rgba(255,255,255,0.35)" stroke="none"/>
        </svg>

        {/* Inner icon, centered over hex */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          paddingTop: px * 0.05 }}>
          <InnerIcon name={badge?.icon || "star"} color={iconColor} size={px}/>
        </div>

        {/* Lock overlay for unearned */}
        {!earned && <LockOverlay size={px}/>}
      </div>
    </>
  );
}