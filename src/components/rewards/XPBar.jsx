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
          0%, 100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(108, 99, 255, 0); }
        }
        @keyframes barGlowPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(108, 99, 255, 0.4); }
          50% { box-shadow: 0 0 24px rgba(108, 99, 255, 0.8), 0 0 0 6px rgba(108, 99, 255, 0.15); }
        }
        @keyframes floatXP {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
        @keyframes progressGlow {
          0% { box-shadow: 0 0 12px rgba(108,99,255,0.6), inset 0 0 8px rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 20px rgba(168,85,247,0.8), inset 0 0 12px rgba(168,85,247,0.6); }
          100% { box-shadow: 0 0 12px rgba(108,99,255,0.6), inset 0 0 8px rgba(168,85,247,0.4); }
        }
        .xp-level-badge { animation: levelPulse 2.5s ease-in-out infinite; }
        .xp-card-container { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .xp-card-container:hover { transform: translateY(-6px); }
      `}</style>

      <div
        className="xp-card-container"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16162a 100%)",
          border: "1px solid rgba(108, 99, 255, 0.2)",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "visible",
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
              right: "24px",
              bottom: "60px",
              color: "#FFD700",
              fontSize: "16px",
              fontWeight: 900,
              fontFamily: "'DM Mono', monospace",
              textShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
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
              borderRadius: "16px",
              background: "radial-gradient(circle, rgba(108, 99, 255, 0.3) 0%, transparent 70%)",
              filter: "blur(12px)",
              pointerEvents: "none",
              animation: "barGlowPulse 0.8s ease-out forwards",
            }}
          />
        )}

        {/* Top Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", position: "relative", zIndex: 1 }}>
          {/* Level Badge */}
          <div
            className="xp-level-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6C63FF 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'DM Mono', monospace",
                boxShadow: "0 4px 16px rgba(108,99,255,0.4)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
            >
              {level.level}
            </div>
            <div>
              <div style={{ color: "#E8E8F0", fontSize: "15px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                {level.title}
              </div>
              <div style={{ color: "#6C63FF", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>
                Level {level.level}
              </div>
            </div>
          </div>

          {/* XP Count */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: "#FFD700",
                fontSize: "20px",
                fontWeight: 800,
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "-0.02em",
                transition: "all 0.3s ease",
                textShadow: hovered ? "0 0 16px rgba(255, 215, 0, 0.5)" : "none",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              {displayedXP.toLocaleString()}
            </div>
            <div style={{ color: "#666", fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
              {nextLevel ? `/ ${nextLevel.minXP.toLocaleString()} XP` : "MAX LEVEL"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: "10px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.05)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${displayedPct}%`,
              borderRadius: "999px",
              background: "linear-gradient(90deg, #6C63FF 0%, #a855f7 50%, #FFD700 100%)",
              backgroundSize: "200% auto",
              animation: barGlow ? "progressGlow 0.8s ease-out" : "xpShimmer 3s linear infinite",
              boxShadow: barGlow ? "0 0 24px rgba(108,99,255,0.8)" : "0 0 12px rgba(108,99,255,0.6)",
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
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#FFD700",
                boxShadow: "0 0 12px #FFD700, 0 0 24px rgba(255, 215, 0, 0.5)",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <span style={{ color: hovered ? "#888" : "#555", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease" }}>
            {getLevelMotivation(currentXP)}
          </span>
          {nextLevel && (
            <span
              style={{
                color: "#6C63FF",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.3s ease",
                textShadow: hovered ? "0 0 12px rgba(108, 99, 255, 0.5)" : "none",
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
