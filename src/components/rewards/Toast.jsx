// src/components/rewards/Toast.jsx
// Custom toast — Apr 24-25 brief
// Types: success (green), info (purple/bell), warning (yellow/triangle), badge, points, streak
// Slides in from top-right, auto-dismiss 3s, X close button

import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";

const TYPE_CFG = {
  success: {
    border: "#22c55e", bg: "rgba(240,253,244,0.96)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    label: "Success",
  },
  info: {
    border: "#6366f1", bg: "rgba(245,243,255,0.96)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    label: "Info",
  },
  warning: {
    border: "#f59e0b", bg: "rgba(255,251,235,0.96)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: "Warning",
  },
  badge: {
    border: "#8b5cf6", bg: "rgba(245,243,255,0.97)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"/>
      </svg>
    ),
    label: "Badge Unlocked!",
  },
  points: {
    border: "#f59e0b", bg: "rgba(255,251,235,0.97)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    label: "Points Earned",
  },
  streak: {
    border: "#ef4444", bg: "rgba(254,242,242,0.97)", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2c0 0-5 5-5 11 0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-2-5-2-5 0 0-1 3-3 3s-2-3-2-3S8 10 8 12"/>
        <circle cx="12" cy="19" r="2" fill="#dc2626"/>
      </svg>
    ),
    label: "Streak!",
  },
};

// Animated +N counter for points toast
function PointsCounter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 600, s = performance.now();
    const tick = (now) => {
      const t = Math.min((now - s) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(e * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, color: "#b45309" }}>+{val}</span>;
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <>
      <style>{`
        @keyframes tSlideIn  { from{transform:translateX(110%) scale(0.85);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes tSlideOut { from{transform:translateX(0) scale(1);opacity:1}       to{transform:translateX(110%) scale(0.85);opacity:0} }
        @keyframes tProgress { from{width:100%} to{width:0%} }
        @keyframes tPop      { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
        .t-wrap      { animation: tSlideIn  0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .t-wrap.exit { animation: tSlideOut 0.38s ease-in forwards; }
        .t-wrap:hover { transform: translateX(-5px) !important; cursor:pointer; }
        .t-x:hover { opacity:1 !important; transform:rotate(90deg) scale(1.2) !important; }
      `}</style>
      <div style={{ position:"fixed", top:24, right:24, zIndex:9999,
        display:"flex", flexDirection:"column", gap:10, maxWidth:370, width:"100%", pointerEvents:"none" }}>
        {toasts.map(t => {
          const cfg = TYPE_CFG[t.type] || TYPE_CFG.info;
          return (
            <div key={t.id} className={`t-wrap${t.exiting?" exit":""}`}
              style={{ background:cfg.bg, border:`1px solid ${cfg.border}44`, borderRadius:14,
                overflow:"hidden", boxShadow:`0 8px 30px rgba(0,0,0,0.1),0 0 0 1px ${cfg.border}22`,
                backdropFilter:"blur(20px)", pointerEvents:"all",
                transition:"transform 0.2s ease" }}
              onClick={() => dismissToast(t.id)}>

              {/* Colored left bar */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3,
                background:`linear-gradient(180deg,${cfg.border},${cfg.border}66)` }}/>

              <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"13px 13px 9px 18px" }}>
                {/* Icon circle */}
                <div style={{ width:30, height:30, borderRadius:8, background:`${cfg.border}18`,
                  border:`1px solid ${cfg.border}33`, display:"flex", alignItems:"center",
                  justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  {cfg.icon}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ color:"#374151", fontSize:12, fontWeight:700, fontFamily:"'DM Mono',monospace",
                    marginBottom:2, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    {cfg.label}
                  </div>
                  <div style={{ color:"#1e1b4b", fontSize:13, fontFamily:"'DM Sans',sans-serif",
                    fontWeight:500, lineHeight:1.4 }}>
                    {t.type === "points" && t.points
                      ? <><PointsCounter target={t.points}/> {t.message}</>
                      : t.type === "streak" && t.streak
                      ? <>{t.message} <span style={{color:"#dc2626",fontWeight:800}}>🔥 {t.streak} days!</span></>
                      : t.message}
                  </div>
                </div>

                <button className="t-x"
                  onClick={e => { e.stopPropagation(); dismissToast(t.id); }}
                  style={{ background:"none", border:"none", color:"#9ca3af", cursor:"pointer",
                    padding:3, opacity:0.55, transition:"all 0.2s", flexShrink:0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Auto-dismiss progress bar */}
              <div style={{ height:2, background:"rgba(0,0,0,0.05)", margin:"0 18px 9px" }}>
                <div style={{ height:"100%", background:cfg.border, borderRadius:999,
                  animation:"tProgress 3.5s linear forwards", opacity:0.6 }}/>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Default export for backwards compat
export default ToastContainer;