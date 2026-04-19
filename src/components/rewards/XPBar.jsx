// src/components/rewards/XPBar.jsx
// Apr 21 brief:
// - Level badge (circle), level name, animated fill bar, X/Y XP text
// - Bar fill: CSS transition 1s when points change
// - Level-up detection: gold flash + new level title flies in (2s auto-dismiss)
// - variant prop: "full" (dashboard) | "mini" (navbar)

import { useEffect, useRef, useState } from "react";
import { getLevelInfo, getLevelMotivation } from "../../utils/levels";

/* ── Level-up overlay ── */
function LevelUpOverlay({ levelName, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes luFlash  { 0%{opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
        @keyframes luTitle  { 0%{opacity:0;transform:scale(0.6) translateY(20px)} 40%{opacity:1;transform:scale(1.1) translateY(-4px)} 60%{transform:scale(1) translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-10px)} }
        @keyframes luStar   { 0%{transform:scale(0) rotate(-30deg);opacity:0} 50%{transform:scale(1.3) rotate(5deg);opacity:1} 100%{transform:scale(1);opacity:1} }
      `}</style>
      <div style={{ position:"fixed", inset:0, zIndex:10500, pointerEvents:"none",
        background:"rgba(255,215,0,0.08)", animation:"luFlash 2.2s ease forwards",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", animation:"luTitle 2.2s ease forwards" }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#b45309",
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.2em", textTransform:"uppercase",
            marginBottom:8 }}>
            LEVEL UP!
          </div>
          <div style={{ fontSize:42, fontWeight:900, color:"#d97706",
            fontFamily:"'Orbitron',monospace", letterSpacing:"-0.02em",
            textShadow:"0 0 30px rgba(217,119,6,0.5)",
            animation:"luStar 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}>
            {levelName}
          </div>
          <div style={{ fontSize:12, color:"#b45309", fontFamily:"'DM Sans',sans-serif", marginTop:6 }}>
            You reached a new rank ✦
          </div>
        </div>
      </div>
    </>
  );
}

export default function XPBar({ totalPoints = 0, variant = "full" }) {
  const [displayPct, setDisplayPct]     = useState(0);
  const [displayXP,  setDisplayXP]      = useState(0);
  const [showLevelUp, setShowLevelUp]   = useState(false);
  const [levelUpName, setLevelUpName]   = useState("");
  const [prevLevel,   setPrevLevel]     = useState(null);
  const [hov, setHov]                   = useState(false);
  const [flash, setFlash]               = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const info = getLevelInfo(totalPoints);

  useEffect(() => {
    // Level-up detection
    if (prevLevel !== null && info.level > prevLevel) {
      setLevelUpName(info.levelName);
      setShowLevelUp(true);
    }
    setPrevLevel(info.level);
  }, [info.level]);

  // Animate bar fill (CSS transition via state)
  useEffect(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    const target    = info.percentage;
    const targetXP  = totalPoints;
    const duration  = 1100;
    startRef.current = performance.now();

    const tick = (now) => {
      const t = Math.min((now - startRef.current) / duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      setDisplayPct(Math.round(e * target));
      setDisplayXP(Math.round(e * targetXP));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [totalPoints, info.percentage]);

  if (variant === "mini") {
    // Navbar mini version
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:26, height:26, borderRadius:8,
          background:"linear-gradient(135deg,#6366f1,#4f46e5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:900, color:"#fff", fontFamily:"'Orbitron',monospace",
          boxShadow:"0 2px 8px rgba(99,102,241,0.35)", flexShrink:0 }}>
          {info.level}
        </div>
        <div style={{ width:80 }}>
          <div style={{ height:4, background:"rgba(99,102,241,0.12)", borderRadius:999, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${displayPct}%`,
              background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
              borderRadius:999, transition:"width 1s ease" }}/>
          </div>
        </div>
        <span style={{ color:"#4f46e5", fontSize:11, fontWeight:700, fontFamily:"'Orbitron',monospace" }}>
          {info.levelName}
        </span>
      </div>
    );
  }

  // Full version
  return (
    <>
      <style>{`
        @keyframes xpBarShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes xpFlash  { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }
        @keyframes xpScanH  { 0%{top:-1px} 100%{top:100%} }
        @keyframes lvBounce { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .xpbar-full { transition:transform 0.3s ease,box-shadow 0.3s ease; }
        .xpbar-full:hover { transform:translateY(-4px); }
      `}</style>

      {showLevelUp && <LevelUpOverlay levelName={levelUpName} onDone={() => setShowLevelUp(false)}/>}

      <div className="xpbar-full"
        style={{
          background:"rgba(255,255,255,0.82)", backdropFilter:"blur(24px)",
          border:`1px solid ${flash?"rgba(99,102,241,0.45)":"rgba(99,102,241,0.14)"}`,
          borderRadius:20, padding:"22px 26px", position:"relative", overflow:"hidden",
          boxShadow: flash
            ? "0 8px 40px rgba(99,102,241,0.18),0 0 0 4px rgba(99,102,241,0.07)"
            : "0 4px 24px rgba(99,102,241,0.09),0 1px 0 rgba(255,255,255,0.9) inset",
          transition:"border-color 0.4s,box-shadow 0.4s",
        }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>

        {/* Flash on update */}
        {flash && <div style={{ position:"absolute",inset:0,background:"rgba(99,102,241,0.05)",
          animation:"xpFlash 0.8s ease forwards",borderRadius:20,pointerEvents:"none" }}/>}

        {/* Scanner line */}
        <div style={{ position:"absolute",left:0,right:0,height:1,
          background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.18),transparent)",
          animation:"xpScanH 5s linear infinite",pointerEvents:"none" }}/>

        {/* Top row */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            {/* Level circle */}
            <div style={{
              width:52,height:52,borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#4f46e5)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:19,fontWeight:900,color:"#fff",fontFamily:"'Orbitron',monospace",
              boxShadow:"0 4px 18px rgba(99,102,241,0.45),inset 0 1px 0 rgba(255,255,255,0.25)",
              animation:flash?"lvBounce 0.5s ease":"none",flexShrink:0,
            }}>
              {info.level}
            </div>
            <div>
              <div style={{color:"#1e1b4b",fontSize:17,fontWeight:800,fontFamily:"'Orbitron',sans-serif",letterSpacing:"-0.01em"}}>
                {info.levelName}
              </div>
              <div style={{color:"#6366f1",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace"}}>
                Level {info.level} {info.icon}
              </div>
            </div>
          </div>

          {/* XP count */}
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#b45309",fontSize:22,fontWeight:900,fontFamily:"'Orbitron',monospace",
              letterSpacing:"-0.03em",
              textShadow:hov?"0 0 16px rgba(180,83,9,0.3)":"none",transition:"text-shadow 0.3s" }}>
              {displayXP.toLocaleString()}
            </div>
            <div style={{ color:"#94a3b8",fontSize:11,fontFamily:"'DM Sans',sans-serif" }}>
              {info.isMaxLevel ? "MAX LEVEL" : `/ ${info.xpNeeded.toLocaleString()} XP`}
            </div>
          </div>
        </div>

        {/* Bar */}
        <div style={{ height:11,background:"rgba(99,102,241,0.08)",borderRadius:999,
          border:"1px solid rgba(99,102,241,0.1)",overflow:"hidden",position:"relative" }}>
          {/* Milestone ticks */}
          {[25,50,75].map(m=>(
            <div key={m} style={{ position:"absolute",left:`${m}%`,top:0,bottom:0,width:1,
              background:displayPct>=m?"rgba(99,102,241,0.35)":"rgba(99,102,241,0.1)",zIndex:2 }}/>
          ))}
          {/* Fill */}
          <div style={{
            height:"100%",width:`${displayPct}%`,borderRadius:999,
            background:"linear-gradient(90deg,#6366f1 0%,#8b5cf6 50%,#d97706 100%)",
            backgroundSize:"200% auto",animation:"xpBarShimmer 2.5s linear infinite",
            boxShadow:"0 0 12px rgba(99,102,241,0.45)",transition:"width 0.12s linear",
            position:"relative",
          }}>
            {/* Leading dot */}
            <div style={{ position:"absolute",right:0,top:"50%",transform:"translate(50%,-50%)",
              width:11,height:11,borderRadius:"50%",background:"#d97706",
              boxShadow:"0 0 10px #d97706,0 0 20px #d9770688" }}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10 }}>
          <span style={{color:"#94a3b8",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>
            {getLevelMotivation(info.percentage)}
          </span>
          <span style={{color:"#6366f1",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
            {info.isMaxLevel ? "MAX LEVEL" : `${displayPct}% → ${info.nextLevelName}`}
          </span>
        </div>
      </div>
    </>
  );
}