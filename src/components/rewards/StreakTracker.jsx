// src/components/rewards/XPBar.jsx
import { useEffect, useRef, useState } from "react";
import { getLevelFromXP, getNextLevel, getProgressPercent, getLevelMotivation } from "../../utils/levels";

export default function XPBar({ currentXP=0 }) {
  const [pct, setPct]     = useState(0);
  const [xpDisp, setXpDisp] = useState(0);
  const [hov, setHov]     = useState(false);
  const [flash, setFlash] = useState(false);
  const raf = useRef(null);

  const targetPct = getProgressPercent(currentXP);
  const level     = getLevelFromXP(currentXP);
  const nextLevel = getNextLevel(currentXP);

  useEffect(() => {
    setFlash(true); setTimeout(() => setFlash(false), 900);
    const dur = 1400, s = performance.now();
    const tick = (now) => {
      const t = Math.min((now-s)/dur, 1), e = 1-Math.pow(1-t,4);
      setPct(Math.round(e*targetPct)); setXpDisp(Math.round(e*currentXP));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [currentXP, targetPct]);

  return (
    <>
      <style>{`
        @keyframes xpShim { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes xpGlow { 0%,100%{box-shadow:0 4px 24px rgba(99,102,241,0.12)} 50%{box-shadow:0 8px 40px rgba(99,102,241,0.22),0 0 0 3px rgba(99,102,241,0.08)} }
        @keyframes lvlBounce { 0%{transform:scale(1)} 40%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes scanH { 0%{top:-1px} 100%{top:100%} }
        .xpbar-card { transition:transform 0.3s ease,box-shadow 0.3s ease; }
        .xpbar-card:hover { transform:translateY(-4px); }
      `}</style>
      <div className="xpbar-card"
        style={{
          background:"rgba(255,255,255,0.72)",
          backdropFilter:"blur(24px)",
          border:`1px solid ${flash?"rgba(99,102,241,0.4)":"rgba(99,102,241,0.15)"}`,
          borderRadius:20, padding:"22px 26px",
          boxShadow: flash
            ? "0 8px 40px rgba(99,102,241,0.18),0 0 0 4px rgba(99,102,241,0.08)"
            : "0 4px 24px rgba(99,102,241,0.1),0 1px 0 rgba(255,255,255,0.9) inset",
          transition:"border-color 0.4s,box-shadow 0.4s",
          position:"relative",overflow:"hidden",
        }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>

        {/* scan line */}
        <div style={{position:"absolute",left:0,right:0,height:1,
          background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.15),transparent)",
          animation:"scanH 5s linear infinite",pointerEvents:"none"}}/>

        {/* Top row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{
              width:50,height:50,borderRadius:14,
              background:"linear-gradient(135deg,#6366f1,#4f46e5)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,fontWeight:900,color:"#fff",
              fontFamily:"'Orbitron',monospace",
              boxShadow:"0 4px 16px rgba(99,102,241,0.4),inset 0 1px 0 rgba(255,255,255,0.25)",
              animation:flash?"lvlBounce 0.5s ease":"none",flexShrink:0,
            }}>{level.level}</div>
            <div>
              <div style={{color:"#1e1b4b",fontSize:16,fontWeight:800,fontFamily:"'Orbitron',sans-serif",letterSpacing:"-0.01em"}}>{level.title}</div>
              <div style={{color:"#6366f1",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace"}}>Level {level.level}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"#b45309",fontSize:22,fontWeight:900,fontFamily:"'Orbitron',monospace",letterSpacing:"-0.03em",
              textShadow:hov?"0 0 16px rgba(180,83,9,0.3)":"none",transition:"text-shadow 0.3s"}}>
              {xpDisp.toLocaleString()}
            </div>
            <div style={{color:"#94a3b8",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>
              {nextLevel?`/ ${nextLevel.minXP.toLocaleString()} XP`:"MAX LEVEL"}
            </div>
          </div>
        </div>

        {/* Bar */}
        <div style={{height:10,background:"rgba(99,102,241,0.08)",borderRadius:999,border:"1px solid rgba(99,102,241,0.12)",overflow:"hidden",position:"relative"}}>
          {[25,50,75].map(m=>(
            <div key={m} style={{position:"absolute",left:`${m}%`,top:0,bottom:0,width:1,
              background:pct>=m?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.1)",zIndex:2}}/>
          ))}
          <div style={{
            height:"100%",width:`${pct}%`,borderRadius:999,
            background:"linear-gradient(90deg,#6366f1,#8b5cf6,#d97706)",
            backgroundSize:"200% auto",animation:"xpShim 2.5s linear infinite",
            boxShadow:"0 0 12px rgba(99,102,241,0.5)",transition:"width 0.12s linear",position:"relative",
          }}>
            <div style={{position:"absolute",right:0,top:"50%",transform:"translate(50%,-50%)",
              width:10,height:10,borderRadius:"50%",background:"#d97706",
              boxShadow:"0 0 10px #d97706,0 0 20px #d9770688"}}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <span style={{color:"#94a3b8",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>{getLevelMotivation(currentXP)}</span>
          {nextLevel&&<span style={{color:"#6366f1",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{pct}% → {nextLevel.title}</span>}
        </div>
      </div>
    </>
  );
}