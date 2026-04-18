// src/components/rewards/BadgeIcon.jsx
import { useState } from "react";

const TIER = {
  bronze:{ border:"#b45309", glow:"rgba(180,83,9,0.35)",  bg:"linear-gradient(135deg,#fef3c7,#fde68a)", shimmer:"#fbbf24" },
  silver:{ border:"#64748b", glow:"rgba(100,116,139,0.3)", bg:"linear-gradient(135deg,#f1f5f9,#e2e8f0)", shimmer:"#cbd5e1" },
  gold:  { border:"#d97706", glow:"rgba(217,119,6,0.45)",  bg:"linear-gradient(135deg,#fef9c3,#fde047)", shimmer:"#facc15" },
};

function IconSVG({ name, color, size }) {
  const s = size * 0.42;
  const p = { fill:`${color}22`, stroke:color, strokeWidth:"1.8", strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    star:  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" {...p}/>,
    flame: <><path d="M12 2c0 0-5 5-5 11 0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-2-5-2-5 0 0-1 3-3 3s-2-3-2-3S8 10 8 12" {...p}/><circle cx="12" cy="19" r="2" fill={color}/></>,
    zap:   <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" {...p}/>,
    book:  <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...p}/></>,
    timer: <><circle cx="12" cy="12" r="9" {...p}/><polyline points="12,7 12,12 15,15" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/><line x1="10" y1="2" x2="14" y2="2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/>,
    trophy:<><path d="M6 9H4a2 2 0 0 1-2-2V5h4" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M6 5h12v4a6 6 0 0 1-12 0z" {...p}/><line x1="12" y1="15" x2="12" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></>,
    award: <><circle cx="12" cy="8" r="6" {...p}/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" {...p}/></>,
    crown: <><path d="M2 19h20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 19l3-8 5 5 2-10 2 10 5-5 3 8" {...p}/></>,
    gem:   <><path d="M6 3h12l4 6-10 13L2 9z" {...p}/><line x1="2" y1="9" x2="22" y2="9" stroke={color} strokeWidth="1.8"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24">{icons[name]||icons.star}</svg>;
}

export default function BadgeIcon({ tier="bronze", icon="star", unlocked=true, size=56 }) {
  const cfg = TIER[tier]||TIER.bronze;
  const [hov, setHov] = useState(false);
  return (
    <>
      <style>{`
        @keyframes biOrbit  { to{transform:rotate(360deg)}  }
        @keyframes biOrbit2 { to{transform:rotate(-360deg)} }
        @keyframes biFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes biShim   { 0%{transform:translateX(-120%) rotate(35deg)} 100%{transform:translateX(300%) rotate(35deg)} }
        @keyframes biGlow   { 0%,100%{opacity:.4} 50%{opacity:.9} }
      `}</style>
      <div style={{position:"relative",width:size,height:size,flexShrink:0}}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        {unlocked&&<div style={{position:"absolute",inset:-size*.3,borderRadius:"50%",
          background:`radial-gradient(circle,${cfg.glow} 0%,transparent 65%)`,
          animation:"biGlow 2.5s ease-in-out infinite",pointerEvents:"none"}}/>}
        {unlocked&&<div style={{position:"absolute",inset:-5,borderRadius:"50%",
          border:`1.5px dashed ${cfg.border}55`,animation:"biOrbit 7s linear infinite"}}/>}
        {unlocked&&tier==="gold"&&<div style={{position:"absolute",inset:-10,borderRadius:"50%",
          borderTop:`1.5px solid ${cfg.border}99`,borderRight:`1.5px solid ${cfg.border}44`,
          borderBottom:"1.5px solid transparent",borderLeft:"1.5px solid transparent",
          animation:"biOrbit2 3.5s linear infinite"}}/>}
        <div style={{
          position:"relative",width:size,height:size,borderRadius:"50%",
          background:unlocked?cfg.bg:"linear-gradient(135deg,#f1f5f9,#e2e8f0)",
          border:`2px solid ${unlocked?cfg.border:"#cbd5e1"}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
          boxShadow:unlocked?`0 4px 20px ${cfg.glow},0 0 0 3px ${cfg.border}18,inset 0 2px 0 rgba(255,255,255,0.8)`:"0 2px 8px rgba(0,0,0,0.08)",
          transform:hov&&unlocked?"scale(1.13)":"scale(1)",
          transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",zIndex:1,
        }}>
          {hov&&unlocked&&<div style={{position:"absolute",inset:0,
            background:`linear-gradient(35deg,transparent 30%,${cfg.shimmer}66 50%,transparent 70%)`,
            animation:"biShim 0.55s ease forwards",pointerEvents:"none"}}/>}
          <div style={{position:"absolute",top:0,left:0,right:0,height:"45%",borderRadius:"50% 50% 0 0",
            background:"rgba(255,255,255,0.5)",pointerEvents:"none"}}/>
          <div style={{animation:unlocked?"biFloat 3s ease-in-out infinite":"none"}}>
            <IconSVG name={icon} color={unlocked?cfg.border:"#94a3b8"} size={size}/>
          </div>
        </div>
        {!unlocked&&<div style={{position:"absolute",inset:0,borderRadius:"50%",
          background:"rgba(255,255,255,0.55)",backdropFilter:"blur(2px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
          <svg width={size*.3} height={size*.3} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>}
      </div>
    </>
  );
}