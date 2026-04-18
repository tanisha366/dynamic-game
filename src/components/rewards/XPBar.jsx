import { useEffect, useRef, useState } from "react";
import {
  getLevelFromXP,
  getNextLevel,
  getProgressPercent,
  getLevelMotivation,
} from "../../utils/levels";

export default function XPBar({ currentXP = 0 }) {
  const [displayedPct, setDisplayedPct] = useState(0);
  const [displayedXP, setDisplayedXP] = useState(0);
  const [xpFloats, setXpFloats] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [barGlow, setBarGlow] = useState(false);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const prevXPRef = useRef(currentXP);

  const targetPct = getProgressPercent(currentXP);
  const level = getLevelFromXP(currentXP);
  const nextLevel = getNextLevel(currentXP);

  // Animate bar fill on mount / XP change
  useEffect(() => {
    // Create floating XP indicators when XP changes significantly
    if (currentXP > prevXPRef.current) {
      const xpGain = currentXP - prevXPRef.current;
      const id = Date.now();
      setXpFloats(prev => [...prev, { id, xp: xpGain }]);
      setTimeout(() => setXpFloats(prev => prev.filter(x => x.id !== id)), 1800);
      setBarGlow(true);
      setTimeout(() => setBarGlow(false), 800);
    }
    prevXPRef.current = currentXP;

    const duration = 1200;
    startRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplayedPct(Math.round(ease * targetPct));
      setDisplayedXP(Math.round(ease * currentXP));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentXP, targetPct]);

  return (
    <>
      <style>{`
        @keyframes xpShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes levelPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
        }
        @keyframes barGlowPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 24px rgba(99, 102, 241, 0.8), 0 0 0 6px rgba(99, 102, 241, 0.15); }
        }
        @keyframes floatXP {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
        @keyframes progressGlow {
          0% { box-shadow: 0 0 12px rgba(99,102,241,0.6), inset 0 0 8px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 20px rgba(168,85,247,0.8), inset 0 0 12px rgba(168,85,247,0.6); }
          100% { box-shadow: 0 0 12px rgba(99,102,241,0.6), inset 0 0 8px rgba(168,85,247,0.4); }
        }
        .xp-level-badge { animation: levelPulse 2.5s ease-in-out infinite; }
        .xp-card-container { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .xp-card-container:hover { transform: translateY(-6px); }

        @media (max-width: 768px) {
          .xp-card-container { padding: 16px 18px !important; }
        }
      `}</style>

      <div
        className="xp-card-container"
        style={{
          background: "linear-gradient(135deg, rgba(240,245,255,0.95) 0%, rgba(245,240,255,0.9) 100%)",
          border: "1.5px solid rgba(99, 102, 241, 0.25)",
          borderRadius: "18px",
          padding: "24px 28px",
          boxShadow: "0 8px 32px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "visible",
          backdropFilter: "blur(20px)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Floating XP indicators */}
        {xpFloats.map(float => (
          <div
            key={float.id}
            style={{
              position: "absolute",
              right: "28px",
              bottom: "70px",
              color: "#d97706",
              fontSize: "18px",
              fontWeight: 900,
              fontFamily: "'DM Mono', monospace",
              textShadow: "0 0 12px rgba(217, 119, 6, 0.6)",
              pointerEvents: "none",
              zIndex: 10,
              animation: "floatXP 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            }}
          >
            +{float.xp.toLocaleString()}
          </div>
        ))}

        {/* Subtle background glow on XP gain */}
        {barGlow && (
          <div
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "18px",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
              filter: "blur(12px)",
              pointerEvents: "none",
              animation: "barGlowPulse 0.8s ease-out forwards",
            }}
          />
        )}

        {/* Top Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", position: "relative", zIndex: 1, flexWrap: "wrap", gap: "12px" }}>
          {/* Level Badge */}
          <div
            className="xp-level-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 900,
                color: "#fff",
                fontFamily: "'DM Mono', monospace",
                boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hovered ? "scale(1.1)" : "scale(1)",
                flexShrink: 0,
              }}
            >
              {level.level}
            </div>
            <div>
              <div style={{ color: "#1e1b4b", fontSize: "clamp(13px, 2vw, 16px)", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                {level.title}
              </div>
              <div style={{ color: "#6366f1", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>
                Level {level.level}
              </div>
            </div>
          </div>

          {/* XP Count */}
          <div style={{ textAlign: "right", minWidth: "120px" }}>
            <div
              style={{
                color: "#d97706",
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: 900,
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "-0.02em",
                transition: "all 0.3s ease",
                textShadow: hovered ? "0 0 16px rgba(217, 119, 6, 0.5)" : "none",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              {displayedXP.toLocaleString()}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
              {nextLevel ? `/ ${nextLevel.minXP.toLocaleString()} XP` : "MAX LEVEL"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: "12px",
            background: "rgba(99,102,241,0.08)",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(99,102,241,0.15)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${displayedPct}%`,
              borderRadius: "999px",
              background: "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #d97706 100%)",
              backgroundSize: "200% auto",
              animation: barGlow ? "progressGlow 0.8s ease-out" : "xpShimmer 3s linear infinite",
              boxShadow: barGlow ? "0 0 24px rgba(99,102,241,0.8)" : "0 0 12px rgba(99,102,241,0.6)",
              transition: "width 0.1s linear",
              position: "relative",
            }}
          >
            {/* Progress marker */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translate(50%, -50%)",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#d97706",
                boxShadow: "0 0 12px #d97706, 0 0 24px rgba(217, 119, 6, 0.6)",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ color: hovered ? "#4f46e5" : "#64748b", fontSize: "clamp(11px, 1.5vw, 13px)", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease", fontStyle: "italic" }}>
            {getLevelMotivation(currentXP)}
          </span>
          {nextLevel && (
            <span
              style={{
                color: "#6366f1",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.3s ease",
                textShadow: hovered ? "0 0 12px rgba(99, 102, 241, 0.5)" : "none",
              }}
            >
              {displayedPct}% → {nextLevel.title}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
