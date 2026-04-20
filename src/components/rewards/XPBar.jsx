// src/components/rewards/XPBar.jsx
import { useEffect, useRef, useState } from "react";
import { getLevelInfo, getLevelMotivation } from "../../utils/levels";

function LevelUpOverlay({ name, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <>
      <style>{`
        @keyframes luBg  { 0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0} }
        @keyframes luTxt { 0%{opacity:0;transform:scale(.6) translateY(20px)}40%{opacity:1;transform:scale(1.1)}60%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-12px)} }
      `}</style>
      <div style={{position:"fixed",inset:0,zIndex:10500,pointerEvents:"none",
        background:"rgba(255,215,0,0.06)",animation:"luBg 2.2s ease forwards",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center",animation:"luTxt 2.2s ease forwards"}}>
          <div style={{color:"#7B7B9A",fontSize:11,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"'DM Mono',monospace",marginBottom:8}}>LEVEL UP!</div>
          <div style={{fontSize:44,fontWeight:900,color:"#FFD700",fontFamily:"'DM Sans',sans-serif",
            letterSpacing:"-0.03em",textShadow:"0 0 40px rgba(255,215,0,0.6)"}}>{name}</div>
          <div style={{color:"#7B7B9A",fontSize:13,fontFamily:"'DM Sans',sans-serif",marginTop:8}}>You reached a new rank ✦</div>
        </div>
      </div>
    </>
  );
}

export default function XPBar({ totalPoints = 0, variant = "full" }) {
  const [pct,      setPct]      = useState(0);
  const [xpDisp,   setXpDisp]   = useState(0);
  const [flash,    setFlash]     = useState(false);
  const [hov,      setHov]       = useState(false);
  const [luName,   setLuName]    = useState("");
  const [showLU,   setShowLU]    = useState(false);
  const prevLevel  = useRef(null);
  const raf        = useRef(null);
  const info       = getLevelInfo(totalPoints);

  useEffect(() => {
    if (prevLevel.current !== null && info.level > prevLevel.current) {
      setLuName(info.levelName); setShowLU(true);
    }
    prevLevel.current = info.level;
  }, [info.level, info.levelName]);

  useEffect(() => {
    setFlash(true); setTimeout(() => setFlash(false), 900);
    const dur = 1200, s = performance.now();
    const tick = now => {
      const t = Math.min((now - s) / dur, 1), e = 1 - Math.pow(1 - t, 4);
      setPct(Math.round(e * info.percentage));
      setXpDisp(Math.round(e * totalPoints));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [totalPoints, info.percentage]);

  if (variant === "mini") return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#6C63FF,#4f46e5)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",
        fontFamily:"'DM Mono',monospace",boxShadow:"0 2px 10px rgba(108,99,255,0.5)",flexShrink:0}}>
        {info.level}
      </div>
      <div style={{width:80,height:4,background:"rgba(108,99,255,0.15)",borderRadius:999,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#6C63FF,#8B5CF6)",borderRadius:999,transition:"width 1s ease"}}/>
      </div>
      <span style={{color:"#6C63FF",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{info.levelName}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes xpShim   { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes xpFlash  { 0%{opacity:0}25%{opacity:1}100%{opacity:0} }
        @keyframes xpScan   { 0%{top:-1px}100%{top:100%} }
        @keyframes xpLvlPop { 0%{transform:scale(1)}45%{transform:scale(1.2)}100%{transform:scale(1)} }
        .xpbar:hover { transform:translateY(-4px)!important; box-shadow:0 16px 50px rgba(108,99,255,0.18)!important; }
      `}</style>
      {showLU && <LevelUpOverlay name={luName} onDone={() => setShowLU(false)}/>}
      <div className="xpbar"
        style={{
          background:"linear-gradient(135deg,#1A1A2E 0%,#13132a 100%)",
          border:`1px solid ${flash?"rgba(108,99,255,0.5)":"rgba(108,99,255,0.14)"}`,
          borderRadius:20,padding:"22px 26px",position:"relative",overflow:"hidden",
          boxShadow:flash?"0 8px 40px rgba(108,99,255,0.2),0 0 0 4px rgba(108,99,255,0.07)":"var(--shadow-card)",
          transition:"border-color .4s,box-shadow .4s,transform .3s ease",
        }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>

        {flash&&<div style={{position:"absolute",inset:0,background:"rgba(108,99,255,0.06)",animation:"xpFlash .9s ease forwards",pointerEvents:"none",borderRadius:20}}/>}
        <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(108,99,255,0.18),transparent)",animation:"xpScan 5s linear infinite",pointerEvents:"none"}}/>

        {/* Top row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:"50%",
              background:"linear-gradient(135deg,#6C63FF,#4f46e5)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:19,fontWeight:900,color:"#fff",fontFamily:"'DM Mono',monospace",
              boxShadow:"0 4px 18px rgba(108,99,255,0.5),inset 0 1px 0 rgba(255,255,255,0.25)",
              animation:flash?"xpLvlPop .5s ease":"none",flexShrink:0}}>
              {info.level}
            </div>
            <div>
              <div style={{color:"var(--text)",fontSize:17,fontWeight:800,fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.01em"}}>{info.levelName}</div>
              <div style={{color:"var(--primary)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace"}}>Level {info.level} {info.icon}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"var(--accent-gold)",fontSize:22,fontWeight:900,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.03em",
              textShadow:hov?"0 0 20px rgba(255,215,0,0.4)":"none",transition:"text-shadow .3s"}}>
              {xpDisp.toLocaleString()}
            </div>
            <div style={{color:"var(--text-muted)",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>
              {info.isMaxLevel?"MAX LEVEL":`/ ${info.xpNeeded.toLocaleString()} XP`}
            </div>
          </div>
        </div>

        {/* Bar */}
        <div style={{height:11,background:"rgba(108,99,255,0.09)",borderRadius:999,border:"1px solid rgba(108,99,255,0.1)",overflow:"hidden",position:"relative"}}>
          {[25,50,75].map(m=>(
            <div key={m} style={{position:"absolute",left:`${m}%`,top:0,bottom:0,width:1,
              background:pct>=m?"rgba(108,99,255,0.4)":"rgba(108,99,255,0.12)",zIndex:2}}/>
          ))}
          <div style={{height:"100%",width:`${pct}%`,borderRadius:999,
            background:"linear-gradient(90deg,#4f46e5 0%,#6C63FF 40%,#a855f7 75%,#FFD700 100%)",
            backgroundSize:"200% auto",animation:"xpShim 2.5s linear infinite",
            boxShadow:"0 0 14px rgba(108,99,255,0.6)",transition:"width .12s linear",position:"relative"}}>
            <div style={{position:"absolute",right:0,top:"50%",transform:"translate(50%,-50%)",
              width:11,height:11,borderRadius:"50%",background:"#FFD700",
              boxShadow:"0 0 12px #FFD700,0 0 24px #FFD70077"}}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <span style={{color:"var(--text-muted)",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>{getLevelMotivation(info.percentage)}</span>
          <span style={{color:"var(--primary)",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
            {info.isMaxLevel?"MAX":` ${pct}% → ${info.nextLevelName}`}
          </span>
        </div>
      </div>
    </>
  );
}