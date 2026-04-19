// src/pages/BadgesPage.jsx
// Apr 22-23 brief:
// - Header: 'My Achievements', earned/total count
// - Category tabs: All, Earned, Locked — filtered grid
// - Earned: full color, date shown
// - Locked: grayscale, 'Complete X to unlock'
// - Hover on locked → tooltip exact condition
// - Next badge progress section: closest-to-unlock badge with specific progress bar
// - Simulate unlock button for testing

import { useState, useMemo, useEffect, useRef } from "react";
import { badges, MOCK_USER, RARITY_CONFIG } from "../mocks/badgeMock";
import BadgeCard from "../components/rewards/BadgeCard";
import BadgeUnlockModal from "../components/rewards/BadgeUnlockModal";
import XPBar from "../components/rewards/XPBar";
import StreakTracker from "../components/rewards/StreakTracker";
import { ToastContainer } from "../components/rewards/Toast";
import { ToastProvider, useToast } from "../context/ToastContext";

/* ══════════════ MYSTIC CANVAS BACKGROUND ══════════════ */
function MysticBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const HEX = 36;
    const HW = HEX*2, HH = Math.sqrt(3)*HEX;
    function hexPath(cx,cy,s){ctx.beginPath();for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6;i===0?ctx.moveTo(cx+s*Math.cos(a),cy+s*Math.sin(a)):ctx.lineTo(cx+s*Math.cos(a),cy+s*Math.sin(a));}ctx.closePath();}

    const RUNES=["⬡","◈","⟡","✦","⬢","◇","⊕","⋈"];
    const runes=Array.from({length:16},(_,i)=>({x:Math.random()*100,y:Math.random()*100,vx:(Math.random()-.5)*.007,vy:-.005-Math.random()*.007,rune:RUNES[i%RUNES.length],size:10+Math.random()*12,alpha:.035+Math.random()*.065,phase:Math.random()*Math.PI*2,speed:.3+Math.random()*.45}));
    const AURORAS=[{r:99,g:102,b:241,ph:0},{r:168,g:85,b:247,ph:1.2},{r:6,g:182,b:212,ph:2.5},{r:245,g:158,b:11,ph:3.8}];
    const ORBS=[{cx:.1,cy:.15,r:240,r2:99,g2:102,b2:241,sp:.3,ph:0},{cx:.85,cy:.1,r:190,r2:168,g2:85,b2:247,sp:.4,ph:1.5},{cx:.8,cy:.78,r:210,r2:6,g2:182,b2:212,sp:.25,ph:3},{cx:.05,cy:.82,r:170,r2:245,g2:158,b2:11,sp:.35,ph:4.5}];

    function draw(){
      t+=.007; ctx.clearRect(0,0,W,H);
      // Aurora
      for(const a of AURORAS){const bY=H*(.12+AURORAS.indexOf(a)*.24)+Math.sin(t*.45+a.ph)*H*.055;const gr=ctx.createLinearGradient(0,bY-75,0,bY+75);gr.addColorStop(0,`rgba(${a.r},${a.g},${a.b},0)`);gr.addColorStop(.5,`rgba(${a.r},${a.g},${a.b},0.048)`);gr.addColorStop(1,`rgba(${a.r},${a.g},${a.b},0)`);ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(0,bY+Math.sin(t*.6)*25);for(let s=0;s<=10;s++)ctx.lineTo((s/10)*W,bY+Math.sin(t*.6+s*.8)*22+Math.sin(t*1.1+s*1.3)*12);ctx.lineTo(W,bY+75);ctx.lineTo(0,bY+75);ctx.closePath();ctx.fill();}
      // Hex grid
      const cols=Math.ceil(W/(HW*.75))+2,rows=Math.ceil(H/HH)+2;
      for(let col=-1;col<cols;col++)for(let row=-1;row<rows;row++){const cx=col*HW*.75,cy=row*HH+(col%2===0?0:HH/2);const dx=cx-W/2,dy=cy-H/2;const dist=Math.sqrt(dx*dx+dy*dy);const pulse=Math.sin(t*1.1-dist*.006)*.5+.5;hexPath(cx,cy,HEX-2);ctx.strokeStyle=`rgba(99,102,241,${.02+pulse*.045})`;ctx.lineWidth=.7;ctx.stroke();if(Math.sin(t*.35+col*1.7+row*2.3)>.97){ctx.fillStyle=`rgba(99,102,241,${.03+pulse*.05})`;ctx.fill();}}
      // Orbs
      for(const o of ORBS){const ox=W*o.cx+Math.sin(t*o.sp+o.ph)*55,oy=H*o.cy+Math.cos(t*o.sp*.7+o.ph)*38;const gr=ctx.createRadialGradient(ox,oy,0,ox,oy,o.r);gr.addColorStop(0,`rgba(${o.r2},${o.g2},${o.b2},0.065)`);gr.addColorStop(1,`rgba(${o.r2},${o.g2},${o.b2},0)`);ctx.fillStyle=gr;ctx.beginPath();ctx.arc(ox,oy,o.r,0,Math.PI*2);ctx.fill();}
      // Runes
      for(const r of runes){const rx=(r.x/100)*W,ry=(r.y/100)*H,w=Math.sin(t*r.speed+r.phase)*7;const a=r.alpha*(.5+Math.sin(t*r.speed*1.4+r.phase)*.5);ctx.save();ctx.globalAlpha=a;ctx.fillStyle="#6366f1";ctx.font=`${r.size}px serif`;ctx.textAlign="center";ctx.fillText(r.rune,rx+w,ry+w*.5);ctx.restore();r.x+=r.vx*100;r.y+=r.vy*100;if(r.y<-5){r.y=105;r.x=Math.random()*100;}if(r.x<-5||r.x>105)r.vx*=-1;}
      raf=requestAnimationFrame(draw);
    }
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

/* ══════════ COUNT UP ══════════ */
function CountUp({ to, dur=900, delay=0 }) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    const t=setTimeout(()=>{const s=performance.now();const tick=now=>{const p=Math.min((now-s)/dur,1),e=1-Math.pow(1-p,3);setV(Math.round(e*to));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);},delay);
    return()=>clearTimeout(t);
  },[to,dur,delay]);
  return <>{v}</>;
}

/* ══════════ WORD CYCLER ══════════ */
function Cycle({words,interval=2100}){
  const[idx,setIdx]=useState(0);const[vis,setVis]=useState(true);
  useEffect(()=>{const id=setInterval(()=>{setVis(false);setTimeout(()=>{setIdx(i=>(i+1)%words.length);setVis(true);},360);},interval);return()=>clearInterval(id);},[]);
  return <span style={{display:"inline-block",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(-8px)",transition:"all 0.32s ease",color:"#4f46e5",fontFamily:"'Orbitron',monospace",textShadow:"0 0 22px rgba(99,102,241,0.4)"}}>{words[idx]}</span>;
}

/* ══════════ NEXT BADGE PROGRESS ══════════ */
function NextBadgeProgress({ badges }) {
  const [hoveredProgress, setHoveredProgress] = useState(false);

  // Find closest-to-unlock locked badge (highest earnedProgress/totalRequired)
  const candidates = badges
    .filter(b => !b.earned && b.totalRequired > 0)
    .map(b => ({ ...b, pct: b.earnedProgress / b.totalRequired }))
    .sort((a,b) => b.pct - a.pct);
  const next = candidates[0];
  if (!next) return null;
  const cfg = RARITY_CONFIG[next.rarity] || RARITY_CONFIG.common;
  const pct = Math.min(100, Math.round((next.earnedProgress / next.totalRequired) * 100));

  return (
    <div
      className="section-box-last"
      onMouseEnter={() => setHoveredProgress(true)}
      onMouseLeave={() => setHoveredProgress(false)}
      style={{
        background:"rgba(255,255,255,0.82)",backdropFilter:"blur(24px)",
        border:`1.5px solid ${hoveredProgress?cfg.stroke+"44":cfg.stroke+"22"}`,borderRadius:20,padding:"22px 26px",
        boxShadow:hoveredProgress?`0 8px 32px ${cfg.glowColor}22,0 2px 0 rgba(255,255,255,0.9) inset`:"0 4px 20px rgba(99,102,241,0.08),0 1px 0 rgba(255,255,255,0.9) inset",
        animation:"nextCardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#6366f1",boxShadow:"0 0 8px #6366f1",animation:"dotBlink 1.5s ease-in-out infinite"}}/>
        <span style={{color:"#4f46e5",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",fontFamily:"'Orbitron',monospace"}}>
          Next Badge Progress
        </span>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{flexShrink:0,transform:hoveredProgress?"scale(1.08)":"scale(1)",transition:"all 0.3s ease"}}>
          <div style={{width:56,height:56,borderRadius:14,background:cfg.gradient,
            border:`1.5px solid ${cfg.stroke}44`,display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 4px 16px ${cfg.glowColor}`,transition:"all 0.3s ease"}}>
            <span style={{fontSize:20}}>{next.icon==="star"?"⭐":next.icon==="lightning"?"⚡":next.icon==="flame"?"🔥":next.icon==="crown"?"👑":next.icon==="book"?"📖":"🌙"}</span>
          </div>
        </div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div>
              <div style={{color:"#1e1b4b",fontSize:15,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>{next.name}</div>
              <div style={{color:"#94a3b8",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{next.unlockCondition}</div>
            </div>
            <span style={{color:cfg.textColor,fontSize:13,fontWeight:900,fontFamily:"'Orbitron',monospace",letterSpacing:"-0.02em",transition:"all 0.3s ease",transform:hoveredProgress?"scale(1.1)":"scale(1)"}}>
              {next.earnedProgress}/{next.totalRequired}
            </span>
          </div>
          {/* Specific progress bar */}
          <div style={{height:8,background:"rgba(99,102,241,0.09)",borderRadius:999,overflow:"hidden",border:"1px solid rgba(99,102,241,0.08)",boxShadow:hoveredProgress?`0 0 12px ${cfg.glowColor}66`:"none",transition:"all 0.3s ease"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:999,
              background:`linear-gradient(90deg,${cfg.stroke},${cfg.stroke}bb)`,
              boxShadow:`0 0 8px ${cfg.glowColor}`,transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{color:"#94a3b8",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{pct}% complete</span>
            <span style={{color:cfg.textColor,fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:600}}>+{next.xpReward} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
function BadgesPageInner() {
  const { showToast } = useToast();
  const [tab, setTab]           = useState("all");    // all | earned | locked
  const [simBadge, setSimBadge] = useState(null);
  const [selBadge, setSelBadge] = useState(null);
  const [pageIn, setPageIn]     = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => { setTimeout(()=>setPageIn(true),80); },[]);

  // Listen for triggerBadgeUnlock events (for Nimrit to call from quiz)
  useEffect(() => {
    const handler = e => setSimBadge(e.detail);
    window.addEventListener("badge:unlock", handler);
    return () => window.removeEventListener("badge:unlock", handler);
  }, []);

  const earnedCount  = badges.filter(b=>b.earned).length;
  const totalCount   = badges.length;

  const filtered = useMemo(() => {
    if (tab==="earned")  return badges.filter(b=>b.earned);
    if (tab==="locked")  return badges.filter(b=>!b.earned);
    return badges;
  }, [tab]);

  // Demo simulate: show a random earned badge unlock
  function handleSimulate() {
    const unlockable = badges.filter(b=>!b.earned);
    const badge = unlockable[Math.floor(Math.random()*unlockable.length)] || badges[0];
    setSimBadge(badge);
  }

  // Dev toast test buttons
  function testToasts() {
    showToast("Quiz saved successfully!", "success");
    setTimeout(()=>showToast("", "points", { points:75, message:"Points earned" }), 600);
    setTimeout(()=>showToast("New streak:", "streak", { streak:MOCK_USER.streakDays }), 1200);
  }

  const TABS = [
    { key:"all",    label:"All",     count:totalCount   },
    { key:"earned", label:"Earned",  count:earnedCount  },
    { key:"locked", label:"Locked",  count:totalCount-earnedCount },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Mono:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{min-height:100vh;background:#f0f0ff}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#eaeaf8} ::-webkit-scrollbar-thumb{background:linear-gradient(#6366f1,#a855f7);border-radius:999px}

        @keyframes pageIn      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroA       { from{opacity:0;transform:translateY(-24px) scale(0.88)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes heroB       { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes eyebrowIn   { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShift   { 0%,100%{background-position:0% 50%} 50%{background-position:200% 50%} }
        @keyframes dotBlink    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.55)} }
        @keyframes sectionIn   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes divLine     { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes cardGrid    { from{opacity:0;transform:translateY(26px) rotateX(5deg)} to{opacity:1;transform:translateY(0) rotateX(0)} }
        @keyframes prismaBar   { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes tabPop      { 0%{transform:scale(1)} 45%{transform:scale(1.09)} 100%{transform:scale(1)} }
        @keyframes statIn      { from{opacity:0;transform:translateY(16px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes scanLine    { 0%{top:-1px;opacity:.5} 100%{top:100%;opacity:.5} }
        @keyframes statHover   { 0%{transform:translateY(0)} 100%{transform:translateY(-6px)} }
        @keyframes glowPulse   { 0%,100%{box-shadow:0 4px 16px rgba(99,102,241,0.1)} 50%{box-shadow:0 8px 28px rgba(99,102,241,0.2)} }
        @keyframes nextCardIn  { from{opacity:0;transform:translateY(20px) rotateX(8deg)} to{opacity:1;transform:translateY(0) rotateX(0)} }
        @keyframes nextHover   { 0%{transform:translateY(0)} 100%{transform:translateY(-8px)} }

        .tab-btn {
          padding:9px 20px;border-radius:999px;
          border:1px solid rgba(0,0,0,0.07);background:rgba(255,255,255,0.65);
          color:#64748b;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:700;
          cursor:pointer;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          backdrop-filter:blur(8px);display:flex;align-items:center;gap:7px;
        }
        .tab-btn:hover { color:#4f46e5;border-color:rgba(99,102,241,0.28);transform:translateY(-2px);background:rgba(255,255,255,0.9);box-shadow:0 4px 12px rgba(99,102,241,0.1); }
        .tab-btn.active { background:linear-gradient(135deg,rgba(99,102,241,0.14),rgba(99,102,241,0.07));border-color:rgba(99,102,241,0.45);color:#3730a3;box-shadow:0 0 18px rgba(99,102,241,0.15),inset 0 1px 0 rgba(255,255,255,0.5);animation:tabPop 0.3s ease; }

        .count-chip { display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;padding:0 6px;border-radius:999px;background:rgba(99,102,241,0.12);color:#4f46e5;font-size:10px;font-weight:800;font-family:'DM Mono',monospace; }
        .tab-btn.active .count-chip { background:rgba(99,102,241,0.2); }

        /* Card wraps and hover effects */
        .card-wrap { animation:cardGrid 0.5s cubic-bezier(0.34,1.2,0.64,1) both; transition:all 0.3s ease; }
        .card-wrap:hover { filter:brightness(1.08); }

        /* Section hover */
        .section-box {
          transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position:relative;
        }
        .section-box:hover {
          transform:translateY(-4px);
        }

        /* Stat card hover */
        .stat-card {
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          cursor:pointer;
        }
        .stat-card:hover {
          transform:translateY(-6px) scale(1.02);
        }

        /* Secondary section - no upward movement to avoid covering headings */
        .section-box-last {
          transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .section-box-last:hover {
          filter:brightness(1.05);
          box-shadow:0 8px 28px rgba(99,102,241,0.12) !important;
        }

        .stat-card { transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .stat-card:hover { transform:translateY(-5px) scale(1.02); }

        .sim-btn { display:inline-flex;align-items:center;gap:9px;padding:12px 24px;border-radius:14px;background:linear-gradient(135deg,rgba(245,158,11,0.11),rgba(180,83,9,0.06));border:1px solid rgba(245,158,11,0.3);color:#b45309;font-size:13px;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);backdrop-filter:blur(12px); }
        .sim-btn:hover { transform:translateY(-3px) scale(1.04);box-shadow:0 10px 28px rgba(180,83,9,0.18);border-color:rgba(245,158,11,0.55); }

        .s-divider { display:flex;align-items:center;gap:14px;margin:36px 0 18px; }
        .s-divline  { flex:1;height:1px;background:linear-gradient(90deg,rgba(99,102,241,0.25),transparent);animation:divLine 0.8s ease 0.3s both; }

        .card-wrap { animation:cardGrid 0.5s cubic-bezier(0.34,1.2,0.64,1) both;transform-origin:center bottom; }
      `}</style>

      <MysticBG/>

      {/* Page base */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:"linear-gradient(135deg,#f0f0ff 0%,#faf9ff 30%,#fff8f2 60%,#f0f8ff 100%)" }}/>

      <div style={{ minHeight:"100vh",color:"#1e1b4b",fontFamily:"'DM Sans',sans-serif",
        position:"relative",zIndex:1,paddingBottom:100,
        opacity:pageIn?1:0,transform:pageIn?"translateY(0)":"translateY(12px)",
        transition:"opacity 0.5s ease,transform 0.5s ease" }}>

        {/* ═══════════════════ HERO HEADER ═══════════════════ */}
        <div style={{position:"relative",overflow:"hidden",
          background:"linear-gradient(180deg,rgba(240,240,255,0.88) 0%,rgba(250,249,255,0.65) 100%)",
          borderBottom:"1px solid rgba(99,102,241,0.1)"}}>

          {/* Prismatic bar */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,
            background:"linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6,#f59e0b,#22c55e,#6366f1)",
            backgroundSize:"300% auto",animation:"prismaBar 4s linear infinite"}}/>

          {/* Scanner */}
          <div style={{position:"absolute",left:0,right:0,height:1,
            background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
            animation:"scanLine 6s ease-in-out infinite",pointerEvents:"none"}}/>

          <div style={{maxWidth:1100,margin:"0 auto",padding:"44px 24px 0",position:"relative",zIndex:1}}>

            {/* Breadcrumb */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:28,fontSize:12,fontFamily:"'DM Mono',monospace"}}>
              {["Dashboard","Rewards","My Achievements"].map((s,i,a)=>(
                <span key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:i===a.length-1?"#4f46e5":"#cbd5e1",fontWeight:i===a.length-1?700:400,cursor:"pointer"}}>{s}</span>
                  {i<a.length-1&&<span style={{color:"#e2e8f0"}}>›</span>}
                </span>
              ))}
            </div>

            {/* Hero row */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:24,marginBottom:34}}>
              <div style={{flex:1,minWidth:280}}>
                {/* Eyebrow */}
                <div style={{display:"inline-flex",alignItems:"center",gap:8,
                  background:"rgba(99,102,241,0.09)",border:"1px solid rgba(99,102,241,0.22)",
                  borderRadius:999,padding:"5px 14px",marginBottom:18,
                  animation:"eyebrowIn 0.6s ease both",backdropFilter:"blur(8px)"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#6366f1",
                    boxShadow:"0 0 8px #6366f1",animation:"dotBlink 1.5s ease-in-out infinite"}}/>
                  <span style={{color:"#4f46e5",fontSize:11,fontWeight:700,textTransform:"uppercase",
                    letterSpacing:"0.15em",fontFamily:"'DM Mono',monospace"}}>
                    Dynamic Gamification · Rewards
                  </span>
                </div>

                {/* Title */}
                <div style={{marginBottom:12}}>
                  <h1 style={{fontSize:"clamp(34px,5vw,58px)",fontWeight:900,fontFamily:"'Orbitron','DM Sans',sans-serif",
                    letterSpacing:"-0.04em",lineHeight:1,margin:0,color:"#1e1b4b",
                    textShadow:"0 2px 24px rgba(99,102,241,0.18)",animation:"heroA 0.7s cubic-bezier(0.34,1.56,0.64,1) both"}}>
                    MY
                  </h1>
                  <h1 style={{fontSize:"clamp(34px,5vw,58px)",fontWeight:900,fontFamily:"'Orbitron','DM Sans',sans-serif",
                    letterSpacing:"-0.04em",lineHeight:1,margin:0,
                    background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 35%,#0891b2 65%,#d97706 100%)",
                    backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                    animation:"heroB 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.08s both, gradShift 5s ease infinite",
                    filter:"drop-shadow(0 2px 10px rgba(99,102,241,0.25))"}}>
                    ACHIEVEMENTS
                  </h1>
                </div>

                {/* Rotating words + lines */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={{height:1,width:40,background:"linear-gradient(90deg,transparent,#6366f1)"}}/>
                  <span style={{fontSize:12,fontWeight:800,letterSpacing:"0.18em"}}>
                    <Cycle words={["CONQUER.","COLLECT.","ASCEND.","LEGEND."]}/>
                  </span>
                  <div style={{height:1,flex:1,background:"linear-gradient(90deg,#6366f1,transparent)"}}/>
                </div>

                {/* Earned count */}
                <p style={{color:"#64748b",fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.65,
                  maxWidth:450,animation:"fadeUp 0.6s ease 0.3s both"}}>
                  <span style={{color:"#15803d",fontWeight:800,fontFamily:"'Orbitron',monospace"}}>{earnedCount}</span>
                  <span style={{color:"#94a3b8"}}> / {totalCount} badges earned</span>
                  {" — "}<span style={{color:"#4f46e5"}}>keep pushing your limits.</span>
                </p>
              </div>

              {/* Right: XP chip + actions */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:12,animation:"fadeUp 0.6s ease 0.4s both"}}>
                <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",
                  border:"1px solid rgba(217,119,6,0.2)",borderRadius:16,padding:"14px 22px",textAlign:"right",
                  boxShadow:"0 4px 20px rgba(180,83,9,0.08),inset 0 1px 0 rgba(255,255,255,0.9)"}}>
                  <div style={{color:"#b45309",fontSize:30,fontWeight:900,fontFamily:"'Orbitron',monospace",
                    letterSpacing:"-0.04em",lineHeight:1,textShadow:"0 2px 12px rgba(180,83,9,0.2)"}}>
                    <CountUp to={MOCK_USER.totalPoints} dur={1400}/>
                  </div>
                  <div style={{color:"#d9a44a",fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>Total XP</div>
                </div>

                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  <button className="sim-btn" onClick={handleSimulate}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5,3 19,12 5,21"/></svg>
                    Simulate Unlock
                  </button>
                  <button onClick={testToasts} style={{padding:"12px 18px",borderRadius:14,
                    background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.18)",
                    color:"#4f46e5",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",
                    transition:"all 0.2s",backdropFilter:"blur(8px)"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,0.14)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,0.07)";}}>
                    Test Toasts
                  </button>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
              {[
                {label:"Badges Earned", value:earnedCount,       color:"#15803d", bg:"rgba(22,163,74,0.1)",  border:"rgba(22,163,74,0.2)",  delay:0  },
                {label:"Locked",        value:totalCount-earnedCount, color:"#4338ca",bg:"rgba(99,102,241,0.08)",border:"rgba(99,102,241,0.18)",delay:80 },
                {label:"Streak Days",   value:MOCK_USER.streakDays,   color:"#ea580c",bg:"rgba(234,88,12,0.08)", border:"rgba(234,88,12,0.2)",  delay:160},
                {label:"Total XP",      value:MOCK_USER.totalPoints,  color:"#b45309",bg:"rgba(180,83,9,0.08)",  border:"rgba(180,83,9,0.2)",   delay:240},
              ].map(s=>(
                <div key={s.label} className="stat-card"
                  style={{background:`rgba(255,255,255,0.8)`,backdropFilter:"blur(20px)",
                    border:`1px solid ${s.border}`,borderRadius:16,padding:"18px 20px",
                    boxShadow:`0 4px 16px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.9)`,
                    animation:`statIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${s.delay}ms both`}}>
                  <div style={{color:s.color,fontSize:28,fontWeight:900,fontFamily:"'Orbitron',monospace",
                    letterSpacing:"-0.04em",lineHeight:1,marginBottom:4,
                    textShadow:`0 2px 12px ${s.color}44`}}>
                    <CountUp to={s.value} delay={s.delay}/>
                  </div>
                  <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Sans',sans-serif"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tab row */}
            <div style={{display:"flex",gap:8,paddingBottom:1}}>
              {TABS.map(t=>(
                <button key={t.key} className={`tab-btn${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
                  {t.label}
                  <span className="count-chip">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════ BODY ═══════════════════ */}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>

          {/* Progress section */}
          <div className="s-divider">
            <span style={{color:"#4f46e5",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",fontFamily:"'Orbitron',monospace",whiteSpace:"nowrap"}}>◈ Progress</span>
            <div className="s-divline"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:8,animation:"sectionIn 0.6s ease 0.1s both"}}>
            <XPBar totalPoints={MOCK_USER.totalPoints}/>
            <StreakTracker streakDays={MOCK_USER.streakDays}/>
          </div>

          {/* Next badge */}
          <div className="s-divider" style={{marginTop:36}}>
            <span style={{color:"#b45309",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",fontFamily:"'Orbitron',monospace",whiteSpace:"nowrap"}}>◈ Next Goal</span>
            <div className="s-divline" style={{background:"linear-gradient(90deg,rgba(180,83,9,0.28),transparent)"}}/>
          </div>
          <NextBadgeProgress badges={badges}/>

          {/* Badge collection */}
          <div className="s-divider" style={{marginTop:40}}>
            <span style={{color:"#7c3aed",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",fontFamily:"'Orbitron',monospace",whiteSpace:"nowrap"}}>◈ Badge Collection</span>
            <div className="s-divline" style={{background:"linear-gradient(90deg,rgba(124,58,237,0.28),transparent)"}}/>
          </div>

          {/* Badge stats summary - Animated cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"All Badges",value:totalCount,color:"#6366f1",bg:"rgba(99,102,241,0.08)"},
              {label:"Unlocked",value:earnedCount,color:"#16a34a",bg:"rgba(22,163,74,0.08)"},
              {label:"Locked",value:totalCount-earnedCount,color:"#ef4444",bg:"rgba(239,68,68,0.08)"},
            ].map((stat,i)=>(
              <div
                key={stat.label}
                className="stat-card"
                onMouseEnter={()=>setHoveredStat(stat.label)}
                onMouseLeave={()=>setHoveredStat(null)}
                style={{
                  background:"rgba(255,255,255,0.78)",backdropFilter:"blur(20px)",
                  border:`1.5px solid ${stat.color}22`,borderRadius:16,padding:"16px 12px",textAlign:"center",
                  boxShadow:`0 4px 16px ${stat.bg}`,
                  animation:`statIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.1}s both`,
                  position:"relative",overflow:"hidden"
                }}>
                {hoveredStat===stat.label && (
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${stat.color}08,transparent)`,pointerEvents:"none"}}/>
                )}
                <div style={{fontSize:24,fontWeight:900,color:stat.color,fontFamily:"'Orbitron',monospace",letterSpacing:"-0.02em",lineHeight:1}}>{stat.value}</div>
                <div style={{fontSize:11,color:"#94a3b8",fontFamily:"'DM Sans',sans-serif",marginTop:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Locked message */}
          {tab==="locked"&&(
            <div style={{background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.1)",
              borderRadius:12,padding:"12px 18px",marginBottom:18,
              color:"#64748b",fontSize:13,fontFamily:"'DM Sans',sans-serif",
              display:"flex",alignItems:"center",gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Hover over any locked badge to see the <strong style={{color:"#4f46e5"}}>exact unlock condition</strong>.</span>
            </div>
          )}

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
            {filtered.map((b,i)=>(
              <div key={b.id} className="card-wrap" style={{animationDelay:`${i*0.06}s`}}>
                <BadgeCard badge={b} onSelect={setSelBadge}/>
              </div>
            ))}
          </div>

          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"80px 20px"}}>
              <div style={{color:"#c7d2fe",fontSize:17,fontWeight:700,fontFamily:"'Orbitron',monospace",marginBottom:8}}>No badges here yet</div>
              <div style={{color:"#e2e8f0",fontSize:13}}>Keep learning to unlock badges!</div>
            </div>
          )}
        </div>
      </div>

      {/* Badge unlock modal */}
      {simBadge && <BadgeUnlockModal badge={simBadge} onClose={()=>{ setSimBadge(null); window.dispatchEvent(new Event("badge:dismissed")); }}/>}
      {selBadge && <BadgeUnlockModal badge={selBadge} onClose={()=>setSelBadge(null)}/>}

      <ToastContainer/>
    </>
  );
}

export default function BadgesPage() {
  return <ToastProvider><BadgesPageInner/></ToastProvider>;
}