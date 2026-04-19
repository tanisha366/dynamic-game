// src/components/rewards/BadgeUnlockModal.jsx
// Apr 19-20 brief — exact animation sequence:
// 0-300ms:   overlay fades in
// 300-600ms: badge scales 0 → 1.2 (bounce easing)
// 600-800ms: badge settles to 1.0
// 800ms-1.2s: 8 light rays burst outward
// 1.2s+:     badge shimmer loop, text fades in
// canvas-confetti: {particleCount:150, spread:70, origin:{y:0.6}, colors:['#FFD700','#8B5CF6','#3B82F6']}
// Dismiss: tap anywhere OR auto-dismiss after 4 seconds
// Exports: triggerBadgeUnlock(badge) function for Nimrit

import { useEffect, useState, useRef, useCallback } from "react";
import BadgeIcon from "./BadgeIcon";
import { useToast } from "../../context/ToastContext";

/* ── Canvas confetti (inline, no extra dep needed if canvas-confetti installed) ── */
function fireConfetti() {
  try {
    // If canvas-confetti is installed
    const confetti = window.confetti;
    if (confetti) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#FFD700","#8B5CF6","#3B82F6"] });
      return;
    }
  } catch (_) {}
  // Fallback: CSS-only confetti particles rendered in modal
}

/* ── 8 Light rays ── */
function LightRays({ active, color }) {
  return (
    <>
      <style>{`
        @keyframes rayBurst {
          0%   { transform: rotate(var(--ra)) scaleY(0); opacity: 0; }
          30%  { opacity: 0.6; }
          100% { transform: rotate(var(--ra)) scaleY(1); opacity: 0; }
        }
      `}</style>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
        {Array.from({length:8},(_,i) => (
          <div key={i} style={{
            position:"absolute",
            width: 2, height: "48%",
            bottom: "50%", left: "calc(50% - 1px)",
            transformOrigin: "bottom center",
            "--ra": `${i * 45}deg`,
            background: `linear-gradient(to top, ${color}88, transparent)`,
            animation: active ? `rayBurst 0.7s ease-out both` : "none",
            animationDelay: `${0.8 + i * 0.02}s`,
            borderRadius: 999,
          }}/>
        ))}
      </div>
    </>
  );
}

/* ── Falling confetti particles (CSS fallback) ── */
function CSSConfetti({ active }) {
  const items = Array.from({length:30},(_,i) => ({
    id:i, x: 5 + Math.random()*90,
    delay: Math.random()*1.2, dur: 2+Math.random()*2,
    size: 5+Math.random()*8,
    color:["#FFD700","#8B5CF6","#3B82F6","#F59E0B","#22c55e"][i%5],
    rot: Math.random()*360, wob: (Math.random()-0.5)*60,
  }));
  return (
    <>
      <style>{`
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg)} 100%{transform:translateY(650px) rotate(var(--r)) translateX(var(--w))} }
      `}</style>
      {active && items.map(c=>(
        <div key={c.id} style={{
          position:"fixed", left:`${c.x}%`, top:0,
          width:c.size, height:c.size*0.45,
          background:c.color, borderRadius:2, opacity:0.85,
          "--r":`${c.rot}deg`, "--w":`${c.wob}px`,
          animation:`confettiFall ${c.dur}s ease-in ${c.delay}s both`,
          pointerEvents:"none", zIndex:10002,
        }}/>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════
   BadgeUnlockModal
══════════════════════════════════════════ */
export default function BadgeUnlockModal({ badge, onClose }) {
  const { showToast } = useToast();
  const [phase, setPhase]     = useState(0); // 0=hidden,1=overlay,2=badge,3=rays,4=text
  const [dismissed, setDismissed] = useState(false);
  const autoRef = useRef(null);

  useEffect(() => {
    if (!badge) return;
    setPhase(0); setDismissed(false);

    const t1 = setTimeout(() => setPhase(1), 20);    // overlay in
    const t2 = setTimeout(() => setPhase(2), 300);   // badge scales in
    const t3 = setTimeout(() => setPhase(3), 800);   // rays burst
    const t4 = setTimeout(() => setPhase(4), 1200);  // text fades in + confetti
    const t5 = setTimeout(() => fireConfetti(), 1300);

    // Auto-dismiss after 4 seconds
    autoRef.current = setTimeout(() => dismiss(), 4000);

    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout); clearTimeout(autoRef.current); };
  }, [badge]);

  const dismiss = useCallback(() => {
    if (dismissed) return;
    setDismissed(true);
    clearTimeout(autoRef.current);
    setPhase(0);
    setTimeout(() => { if (onClose) onClose(); }, 320);
  }, [dismissed, onClose]);

  useEffect(() => {
    if (badge && phase >= 4) {
      showToast(`${badge.name} badge unlocked!`, "badge");
    }
  }, [phase, badge]);

  if (!badge) return null;
  const cfg = { common:{stroke:"#9CA3AF"}, rare:{stroke:"#3B82F6"}, epic:{stroke:"#8B5CF6"}, legendary:{stroke:"#F59E0B"} };
  const rayColor = cfg[badge.rarity]?.stroke || "#8B5CF6";

  return (
    <>
      <style>{`
        @keyframes overlayIn    { from{opacity:0}                        to{opacity:1} }
        @keyframes overlayOut   { from{opacity:1}                        to{opacity:0} }
        @keyframes badgeBounceIn{ 0%{transform:scale(0) rotate(-10deg);opacity:0} 65%{transform:scale(1.22) rotate(4deg)} 80%{transform:scale(0.95) rotate(-2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes badgeOut     { from{transform:scale(1);opacity:1}     to{transform:scale(0.7) translateY(20px);opacity:0} }
        @keyframes textReveal   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes prismaTop    { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes glowRing     { 0%,100%{box-shadow:0 0 20px var(--rc)66} 50%{box-shadow:0 0 50px var(--rc)99,0 0 90px var(--rc)33} }
        @keyframes unlockWord   { 0%{letter-spacing:0.05em;opacity:0} 60%{letter-spacing:0.25em;opacity:1} 100%{letter-spacing:0.18em} }
      `}</style>

      <CSSConfetti active={phase >= 4}/>

      {/* Overlay */}
      <div onClick={dismiss}
        style={{ position:"fixed", inset:0, zIndex:10000,
          background:"rgba(15,14,40,0.72)", backdropFilter:"blur(14px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          animation: phase >= 1 ? "overlayIn 0.3s ease forwards" : "overlayOut 0.32s ease forwards",
          opacity: phase >= 1 ? 1 : 0,
        }}>

        {/* Card */}
        <div onClick={e => e.stopPropagation()}
          style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(40px)",
            borderRadius:28, padding:"44px 36px", maxWidth:440, width:"100%", textAlign:"center",
            position:"relative", overflow:"hidden",
            boxShadow:"0 40px 100px rgba(0,0,0,0.22),0 0 0 1px rgba(255,255,255,0.85) inset",
          }}>

          {/* Prismatic top bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
            background:"linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6,#f59e0b,#22c55e,#6366f1)",
            backgroundSize:"300% auto", animation:"prismaTop 3.5s linear infinite" }}/>

          {/* Light rays */}
          <LightRays active={phase >= 3} color={rayColor}/>

          {/* UNLOCKED label */}
          <div style={{
            fontSize:11, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase",
            fontFamily:"'Orbitron',monospace", color:rayColor,
            marginBottom:8, animation:phase>=4?"unlockWord 0.6s ease both":"none",
            textShadow:`0 0 12px ${rayColor}44`, position:"relative", zIndex:2,
          }}>
            ✦ New Badge Unlocked ✦
          </div>

          {/* Badge */}
          <div style={{ display:"flex", justifyContent:"center", margin:"18px 0 22px",
            position:"relative", zIndex:2,
            "--rc": rayColor, animation: phase>=3?"glowRing 2s ease-in-out infinite":"none",
            borderRadius:"50%", padding:12,
            background:`radial-gradient(circle,${rayColor}11 0%,transparent 70%)`,
          }}>
            <div style={{
              animation: phase>=2
                ? "badgeBounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both"
                : "none",
              display:"flex",
            }}>
              <BadgeIcon badge={badge} size={96} earned animated/>
            </div>
          </div>

          {/* Text — fades in at phase 4 */}
          {phase >= 4 && (
            <>
              {/* Badge name in gold */}
              <h2 style={{ color:"#b45309", fontSize:24, fontWeight:900,
                fontFamily:"'Orbitron',sans-serif", letterSpacing:"-0.02em",
                marginBottom:8, animation:"textReveal 0.5s ease both",
                textShadow:"0 2px 12px rgba(180,83,9,0.2)", position:"relative", zIndex:2,
              }}>
                {badge.name}
              </h2>

              {/* Description in gray */}
              <p style={{ color:"#64748b", fontSize:13, lineHeight:1.65,
                fontFamily:"'DM Sans',sans-serif", maxWidth:320, margin:"0 auto 22px",
                animation:"textReveal 0.5s ease 0.08s both", position:"relative", zIndex:2,
              }}>
                {badge.description}
              </p>

              {/* XP reward */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8,
                background:"rgba(245,158,11,0.09)", border:"1px solid rgba(245,158,11,0.25)",
                borderRadius:999, padding:"8px 20px", marginBottom:24,
                animation:"textReveal 0.5s ease 0.14s both", position:"relative", zIndex:2,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                <span style={{ color:"#b45309", fontSize:16, fontWeight:900, fontFamily:"'Orbitron',monospace" }}>
                  +{badge.xpReward} XP
                </span>
              </div>

              {/* Dismiss button */}
              <button onClick={dismiss}
                style={{ width:"100%", padding:"14px", position:"relative", zIndex:2,
                  background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none",
                  borderRadius:14, color:"#fff", fontSize:15, fontWeight:800,
                  fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(99,102,241,0.4),inset 0 1px 0 rgba(255,255,255,0.2)",
                  animation:"textReveal 0.5s ease 0.2s both",
                  transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(99,102,241,0.5)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,0.4)"; }}>
                Awesome! Continue →
              </button>

              <div style={{ marginTop:10, color:"#cbd5e1", fontSize:11, fontFamily:"'DM Mono',monospace", zIndex:2, position:"relative" }}>
                Tap anywhere to dismiss
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   triggerBadgeUnlock — exported for Nimrit to call from quiz result
   Usage: triggerBadgeUnlock(badgeObject)
   This uses a global event so the modal in App.jsx catches it
══════════════════════════════════════════ */
export function triggerBadgeUnlock(badge) {
  window.dispatchEvent(new CustomEvent("badge:unlock", { detail: badge }));
}

/* Queue manager — shows multiple badges one by one with 500ms gap (Apr 26-28) */
export function triggerBadgeUnlockQueue(badges = []) {
  if (!badges.length) return;
  let idx = 0;
  function showNext() {
    if (idx >= badges.length) return;
    triggerBadgeUnlock(badges[idx]);
    idx++;
  }
  showNext();
  // Next badge fires 500ms after previous dismiss
  window._badgeQueueListener = () => {
    setTimeout(showNext, 500);
  };
  window.addEventListener("badge:dismissed", window._badgeQueueListener, { once: true });
}