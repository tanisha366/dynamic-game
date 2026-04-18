// src/pages/BadgesPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { badges as allBadges, MOCK_USER } from "../mocks/badgeMock";
import BadgeCard from "../components/rewards/BadgeCard";
import BadgeUnlockModal from "../components/rewards/BadgeUnlockModal";
import XPBar from "../components/rewards/XPBar";
import StreakTracker from "../components/rewards/StreakTracker";
import Toast from "../components/rewards/Toast";
import { ToastProvider } from "../context/ToastContext";

const FILTERS = [
  { key:"all",label:"All" },{ key:"unlocked",label:"Unlocked" },
  { key:"locked",label:"Locked" },{ key:"bronze",label:"Bronze" },
  { key:"silver",label:"Silver" },{ key:"gold",label:"Gold" },
];
const CATS = ["all","milestone","streak","performance","exploration"];
const DEMO = { id:"demo",name:"Week Warrior",description:"Maintain a perfect 7-day streak.",
  icon:"shield",xpRequired:1200,xpReward:200,tier:"gold",unlocked:true,unlockedAt:new Date().toISOString(),category:"streak" };

/* ══════════════ ANIMATED BACKGROUND CANVAS ══════════════ */
function MysticBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    let t = 0;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Hex grid
    const HEX_SIZE = 38;
    const HEX_W = HEX_SIZE * 2;
    const HEX_H = Math.sqrt(3) * HEX_SIZE;
    function hexPath(cx, cy, s) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + s * Math.cos(angle);
        const y = cy + s * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    // Floating rune symbols
    const RUNES = ["⬡","◈","⟡","✦","⬢","◇","⊕","⋈"];
    const runeObjects = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.008, vy: -0.006 - Math.random() * 0.008,
      rune: RUNES[i % RUNES.length],
      size: 10 + Math.random() * 14,
      alpha: 0.04 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    }));

    // Aurora bands
    const auroraColors = [
      { r:99,  g:102, b:241, phase:0    }, // indigo
      { r:168, g:85,  b:247, phase:1.2  }, // purple
      { r:6,   g:182, b:212, phase:2.4  }, // cyan
      { r:217, g:119, b:6,   phase:3.6  }, // amber
    ];

    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // ── Aurora bands ──
      for (let band = 0; band < 4; band++) {
        const ac = auroraColors[band];
        const bY = H * (0.15 + band * 0.22) + Math.sin(t * 0.5 + ac.phase) * H * 0.06;
        const grad = ctx.createLinearGradient(0, bY - 80, 0, bY + 80);
        grad.addColorStop(0, `rgba(${ac.r},${ac.g},${ac.b},0)`);
        grad.addColorStop(0.5, `rgba(${ac.r},${ac.g},${ac.b},0.055)`);
        grad.addColorStop(1, `rgba(${ac.r},${ac.g},${ac.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        // Wavy band using bezier
        ctx.moveTo(0, bY + Math.sin(t * 0.7 + 0) * 30);
        const steps = 8;
        for (let s = 0; s <= steps; s++) {
          const px = (s / steps) * W;
          const py = bY + Math.sin(t * 0.7 + s * 0.8) * 25 + Math.sin(t * 1.1 + s * 1.3) * 15;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(W, bY + 80); ctx.lineTo(0, bY + 80);
        ctx.closePath();
        ctx.fill();
      }

      // ── Hex grid ──
      const cols = Math.ceil(W / (HEX_W * 0.75)) + 2;
      const rows = Math.ceil(H / HEX_H) + 2;
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * HEX_W * 0.75;
          const cy = row * HEX_H + (col % 2 === 0 ? 0 : HEX_H / 2);
          // Pulse based on distance from center + time
          const dx = cx - W/2, dy = cy - H/2;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const pulse = Math.sin(t * 1.2 - dist * 0.006) * 0.5 + 0.5;
          const alpha = 0.025 + pulse * 0.05;
          hexPath(cx, cy, HEX_SIZE - 2);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
          // Occasionally fill a hex brightly
          if (Math.sin(t * 0.4 + col * 1.7 + row * 2.3) > 0.96) {
            ctx.fillStyle = `rgba(99,102,241,${0.04 + pulse * 0.06})`;
            ctx.fill();
          }
        }
      }

      // ── Floating energy orbs ──
      const orbConfigs = [
        { cx:0.12, cy:0.18, r:220, r2:99,  g2:102, b2:241, speed:0.3,  phase:0   },
        { cx:0.85, cy:0.12, r:180, r2:168, g2:85,  b2:247, speed:0.45, phase:1.5 },
        { cx:0.78, cy:0.75, r:200, r2:6,   g2:182, b2:212, speed:0.25, phase:3   },
        { cx:0.08, cy:0.8,  r:160, r2:217, g2:119, b2:6,   speed:0.35, phase:4.5 },
        { cx:0.5,  cy:0.5,  r:300, r2:168, g2:85,  b2:247, speed:0.18, phase:2.2 },
      ];
      for (const o of orbConfigs) {
        const ox = W * o.cx + Math.sin(t * o.speed + o.phase) * 60;
        const oy = H * o.cy + Math.cos(t * o.speed * 0.7 + o.phase) * 40;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        grad.addColorStop(0, `rgba(${o.r2},${o.g2},${o.b2},0.07)`);
        grad.addColorStop(1, `rgba(${o.r2},${o.g2},${o.b2},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(ox, oy, o.r, 0, Math.PI*2); ctx.fill();
      }

      // ── Shooting light beams ──
      if (Math.sin(t * 0.8) > 0.92) {
        const bx = Math.random() * W;
        ctx.save();
        const bGrad = ctx.createLinearGradient(bx, 0, bx + 60, H * 0.4);
        bGrad.addColorStop(0, "rgba(99,102,241,0)");
        bGrad.addColorStop(0.3, "rgba(99,102,241,0.06)");
        bGrad.addColorStop(1, "rgba(99,102,241,0)");
        ctx.strokeStyle = bGrad;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx+40, H*0.4); ctx.stroke();
        ctx.restore();
      }

      // ── Floating runes ──
      for (const r of runeObjects) {
        const rx = (r.x / 100) * W;
        const ry = (r.y / 100) * H;
        const wobble = Math.sin(t * r.speed + r.phase) * 8;
        const fadeAlpha = r.alpha * (0.5 + Math.sin(t * r.speed * 1.5 + r.phase) * 0.5);
        ctx.save();
        ctx.globalAlpha = fadeAlpha;
        ctx.fillStyle = "#6366f1";
        ctx.font = `${r.size}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(r.rune, rx + wobble, ry + wobble * 0.5);
        ctx.restore();
        r.x += r.vx * 100;
        r.y += r.vy * 100;
        if (r.y < -5) { r.y = 105; r.x = Math.random() * 100; }
        if (r.x < -5 || r.x > 105) r.vx *= -1;
      }

      // ── Particle sparkles ──
      for (let i = 0; i < 3; i++) {
        const sx = Math.random() * W;
        const sy = Math.random() * H;
        if (Math.random() > 0.97) {
          const colors = ["rgba(99,102,241,0.4)","rgba(217,119,6,0.4)","rgba(168,85,247,0.4)","rgba(6,182,212,0.35)"];
          ctx.save();
          ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
          ctx.shadowBlur = 6; ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />;
}

/* ══════ WORD CYCLER ══════ */
function WordCycler({ words, interval=2200 }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i=>(i+1)%words.length); setVis(true); }, 380);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return (
    <span style={{ display:"inline-block", opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(-8px)",
      transition:"opacity 0.35s ease, transform 0.35s ease",
      color:"#4f46e5", fontFamily:"'Orbitron',monospace",
      textShadow:"0 0 24px rgba(99,102,241,0.4)" }}>
      {words[idx]}
    </span>
  );
}

/* ══════ COUNT UP ══════ */
function CountUp({ to, delay=0, dur=1000 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const s = performance.now();
      const tick = now => { const p=Math.min((now-s)/dur,1),e=1-Math.pow(1-p,3); setV(Math.round(e*to)); if(p<1)requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [to, delay, dur]);
  return <>{v.toLocaleString()}</>;
}

/* ══════ STAT CARD ══════ */
function StatCard({ label, value, color, darkColor, icon, delay, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:hov?`linear-gradient(145deg,${color}18,rgba(255,255,255,0.9))`:"rgba(255,255,255,0.75)",
        backdropFilter:"blur(20px)",
        border:`1px solid ${hov?color+"44":"rgba(0,0,0,0.06)"}`,
        borderRadius:16, padding:"18px 20px",
        boxShadow:hov?`0 16px 40px ${color}18,0 2px 0 rgba(255,255,255,0.9) inset`:"0 4px 16px rgba(0,0,0,0.06),0 1px 0 rgba(255,255,255,0.9) inset",
        transform:hov?"translateY(-5px) scale(1.02)":"none",
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        position:"relative", overflow:"hidden",
        animation:`scIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`,
      }}>
      <div style={{position:"absolute",top:0,right:0,width:50,height:50,
        borderRadius:"0 16px 0 100%",background:`${color}12`,
        display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:"10px 10px 0 0"}}>
        {icon}
      </div>
      {hov&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color}88,transparent)`}}/>}
      <div style={{color:darkColor||color,fontSize:30,fontWeight:900,fontFamily:"'Orbitron',monospace",
        letterSpacing:"-0.04em",lineHeight:1,marginBottom:3,
        textShadow:hov?`0 0 16px ${color}66`:"none",transition:"text-shadow 0.3s"}}>
        <CountUp to={parseInt(value)||0} delay={delay}/>
      </div>
      <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'DM Sans',sans-serif"}}>{label}</div>
      {sub&&<div style={{color:color,fontSize:10,fontFamily:"'DM Mono',monospace",marginTop:2,opacity:0.7}}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════ MAIN PAGE ══════════════════════ */
function BadgesPageInner() {
  const [filter, setFilter]     = useState("all");
  const [cat, setCat]           = useState("all");
  const [search, setSearch]     = useState("");
  const [selBadge, setSelBadge] = useState(null);
  const [simModal, setSimModal] = useState(false);
  const [sFocused, setSFocused] = useState(false);
  const [pageIn, setPageIn]     = useState(false);

  useEffect(() => { setTimeout(()=>setPageIn(true),80); }, []);

  const filtered = useMemo(() => allBadges.filter(b => {
    const mf=filter==="all"||(filter==="unlocked"&&b.unlocked)||(filter==="locked"&&!b.unlocked)||b.tier===filter;
    const mc=cat==="all"||b.category===cat;
    const ms=!search||b.name.toLowerCase().includes(search.toLowerCase())||b.description.toLowerCase().includes(search.toLowerCase());
    return mf&&mc&&ms;
  }), [filter,cat,search]);

  const unlocked    = allBadges.filter(b=>b.unlocked).length;
  const xpFromBadge = allBadges.filter(b=>b.unlocked).reduce((s,b)=>s+b.xpReward,0);
  const nextUnlocked = allBadges.find(b=>!b.unlocked);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Mono:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{min-height:100vh;background:#f0f0ff}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#e8e8f8}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#6366f1,#a855f7);border-radius:999px}

        @keyframes scIn        { from{opacity:0;transform:translateY(18px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pageIn      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroTitleA  { from{opacity:0;transform:translateY(-28px) scale(0.88)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes heroTitleB  { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes eyebrowIn   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShift   { 0%,100%{background-position:0% 50%} 50%{background-position:200% 50%} }
        @keyframes dotBlink    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.6)} }
        @keyframes divLine     { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes filterPop   { 0%{transform:scale(1)} 45%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes stickySlideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes filterUnderline { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes nextGoalGlow { 0%,100%{box-shadow:0 4px 24px rgba(99,102,241,0.06),inset 0 1px 0 rgba(255,255,255,0.8)} 50%{box-shadow:0 8px 40px rgba(99,102,241,0.15),inset 0 1px 0 rgba(255,255,255,0.8)} }
        @keyframes nextGoalHover { from{transform:translateY(0)} to{transform:translateY(-4px)} }
        @keyframes bcShimmerMove { 0%{left:-100%;opacity:0} 50%{opacity:1} 100%{left:100%;opacity:0} }
        @keyframes bcBadgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }


        /* Filter tabs */
        .f-btn {
          padding:8px 18px; border-radius:999px;
          border:1px solid rgba(0,0,0,0.07); background:rgba(255,255,255,0.6);
          color:#64748b; font-size:13px; font-family:'DM Sans',sans-serif; font-weight:600;
          cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          white-space:nowrap; backdrop-filter:blur(8px);
        }
        .f-btn:hover { border-color:rgba(99,102,241,0.3); color:#4f46e5; transform:translateY(-2px); background:rgba(255,255,255,0.85); box-shadow:0 4px 12px rgba(99,102,241,0.1); }
        .f-btn.active { background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.06)); border-color:rgba(99,102,241,0.4); color:#4338ca; box-shadow:0 0 16px rgba(99,102,241,0.15),inset 0 1px 0 rgba(255,255,255,0.6); animation:filterPop 0.3s ease; position:relative; }
        .f-btn.active::after { content:""; position:absolute; bottom:-14px; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(99,102,241,0.8),transparent); animation:filterUnderline 0.35s ease forwards; }
        .f-btn.active-bronze { background:rgba(180,83,9,0.1);  border-color:rgba(180,83,9,0.35);   color:#b45309; }
        .f-btn.active-silver { background:rgba(71,85,105,0.08); border-color:rgba(71,85,105,0.3);  color:#475569; }
        .f-btn.active-gold   { background:rgba(217,119,6,0.1); border-color:rgba(217,119,6,0.35);  color:#d97706; }

        /* Category pills */
        .c-pill {
          padding:6px 14px; border-radius:10px;
          border:1px solid rgba(0,0,0,0.05); background:rgba(255,255,255,0.5);
          color:#94a3b8; font-size:11px; font-family:'DM Mono',monospace;
          cursor:pointer; transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1); text-transform:capitalize;
          backdrop-filter:blur(8px);
        }
        .c-pill:hover  { color:#4f46e5; border-color:rgba(99,102,241,0.2); transform:translateY(-2px) scale(1.05); background:rgba(255,255,255,0.8); box-shadow:0 4px 12px rgba(99,102,241,0.08); }
        .c-pill.active { background:rgba(255,255,255,0.85); border-color:rgba(99,102,241,0.25); color:#3730a3; box-shadow:0 2px 8px rgba(99,102,241,0.1); }

        /* Search */
        .s-input {
          background:rgba(255,255,255,0.7); border:1px solid rgba(0,0,0,0.08);
          border-radius:12px; color:#1e1b4b; font-family:'DM Sans',sans-serif; font-size:13px;
          padding:10px 14px 10px 38px; width:210px; outline:none;
          transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1); backdrop-filter:blur(12px);
        }
        .s-input:focus { border-color:rgba(99,102,241,0.4); background:rgba(255,255,255,0.95); width:280px; box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .s-input::placeholder { color:#cbd5e1; }

        /* Simulate btn */
        .sim-btn {
          display:inline-flex; align-items:center; gap:9px;
          padding:12px 24px; border-radius:14px;
          background:linear-gradient(135deg,rgba(217,119,6,0.1),rgba(180,83,9,0.06));
          border:1px solid rgba(217,119,6,0.3); color:#b45309;
          font-size:13px; font-weight:800; font-family:'DM Sans',sans-serif;
          cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          backdrop-filter:blur(12px); animation:xpChipGlow 2.5s ease-in-out infinite;
        }
        .sim-btn:hover { transform:translateY(-4px) scale(1.05); box-shadow:0 12px 32px rgba(180,83,9,0.25); border-color:rgba(217,119,6,0.55); background:linear-gradient(135deg,rgba(217,119,6,0.15),rgba(180,83,9,0.1)); }
        .sim-btn:active { transform:scale(0.97); }

        /* Section divider */
        .s-div { display:flex; align-items:center; gap:14px; margin:38px 0 20px; }
        .s-div-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(99,102,241,0.25),transparent); animation:divLine 0.8s ease 0.3s both; }

        /* card grid */
        .c-grid-item { animation:cardStagger 0.5s cubic-bezier(0.34,1.2,0.64,1) both; transform-origin:center bottom; }
        .c-grid-item:hover { filter:brightness(1.05); }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .c-grid-item { width: 100%; }
          .c-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important; }
        }

        @media (max-width: 768px) {
          h1 { font-size: clamp(32px, 7vw, 52px) !important; }
          .f-btn { padding: 7px 14px; font-size: 12px; }
          .s-input { width: 160px; padding: 8px 12px 8px 32px; }
          .s-input:focus { width: 220px; }
          .c-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; gap: 10px !important; }
          .sim-btn { padding: 10px 18px; font-size: 12px; gap: 6px; }
          .s-div { margin: 28px 0 16px; }
        }

        @media (max-width: 640px) {
          body { font-size: 14px; }
          h1 { font-size: clamp(28px, 6vw, 40px) !important; }
          .f-btn { padding: 6px 12px; font-size: 11px; }
          .s-input { width: 140px; font-size: 12px; }
          .s-input:focus { width: 100%; }
          .c-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important; gap: 8px !important; }
          .sim-btn { padding: 8px 14px; font-size: 11px; width: 100%; justify-content: center; }
          .s-div { margin: 20px 0 12px; gap: 10px; }
          .c-pill { padding: 5px 10px; font-size: 10px; }
          [style*="padding: 24px"] { padding: 16px !important; }
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>

      <MysticBackground />

      {/* Base background gradient */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:"linear-gradient(135deg,#f0f0ff 0%,#faf9ff 30%,#fff8f0 60%,#f0f8ff 100%)" }} />

      <div style={{ minHeight:"100vh", color:"#1e1b4b", fontFamily:"'DM Sans',sans-serif",
        position:"relative", zIndex:1, paddingBottom:100,
        opacity:pageIn?1:0, transform:pageIn?"translateY(0)":"translateY(12px)",
        transition:"opacity 0.5s ease, transform 0.5s ease" }}>

        {/* ══════════════════════ HERO HEADER ══════════════════════ */}
        <div style={{ position:"relative", overflow:"hidden",
          background:"linear-gradient(180deg,rgba(240,240,255,0.85) 0%,rgba(250,249,255,0.6) 100%)",
          borderBottom:"1px solid rgba(99,102,241,0.1)" }}>

          {/* Prismatic top bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
            background:"linear-gradient(90deg,#6366f1,#a855f7,#06b6d4,#f59e0b,#16a34a,#6366f1)",
            backgroundSize:"300% auto", animation:"prismaMove 4s linear infinite" }} />

          {/* Scanner line */}
          <div style={{ position:"absolute", left:0, right:0, height:1,
            background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
            animation:"scannerLine 6s ease-in-out infinite", pointerEvents:"none" }} />

          <div style={{ maxWidth:1100, margin:"0 auto", padding:"44px 24px 0", position:"relative", zIndex:1 }}>

            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:30,
              fontSize:12, fontFamily:"'DM Mono',monospace" }}>
              {["Dashboard","Rewards","Badges"].map((s,i,a) => (
                <span key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:i===a.length-1?"#4f46e5":"#cbd5e1", fontWeight:i===a.length-1?700:400,
                    cursor:"pointer", transition:"color 0.2s" }}
                    onMouseEnter={e=>{ if(i<a.length-1) e.target.style.color="#94a3b8"; }}
                    onMouseLeave={e=>{ if(i<a.length-1) e.target.style.color="#cbd5e1"; }}>
                    {s}
                  </span>
                  {i<a.length-1&&<span style={{color:"#e2e8f0"}}>›</span>}
                </span>
              ))}
            </div>

            {/* Hero row */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:24, marginBottom:36 }}>
              <div style={{ flex:1, minWidth:280 }}>

                {/* Eyebrow pill */}
                <div style={{ display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                  borderRadius:999, padding:"5px 14px", marginBottom:18,
                  animation:"eyebrowIn 0.6s ease both", backdropFilter:"blur(8px)" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#6366f1",
                    boxShadow:"0 0 8px #6366f1", animation:"dotBlink 1.5s ease-in-out infinite" }} />
                  <span style={{ color:"#4f46e5", fontSize:11, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:"0.15em", fontFamily:"'DM Mono',monospace" }}>
                    Dynamic Gamification · Rewards Hub
                  </span>
                </div>

                {/* Title */}
                <div style={{ marginBottom:12 }}>
                  <h1 style={{ fontSize:"clamp(38px, 6vw, 64px)", fontWeight:900,
                    fontFamily:"'Orbitron','DM Sans',sans-serif", letterSpacing:"-0.04em",
                    lineHeight:1.0, margin:0, color:"#1e1b4b",
                    textShadow:"0 2px 30px rgba(99,102,241,0.2), 0 0 60px rgba(99,102,241,0.08)",
                    animation:"heroTitleA 0.7s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                    YOUR
                  </h1>
                  <h1 style={{ fontSize:"clamp(38px, 6vw, 64px)", fontWeight:900,
                    fontFamily:"'Orbitron','DM Sans',sans-serif", letterSpacing:"-0.04em",
                    lineHeight:1.0, margin:0,
                    background:"linear-gradient(135deg,#4f46e5 0%,#7c3aed 35%,#0891b2 65%,#d97706 100%)",
                    backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    animation:"heroTitleB 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.08s both, gradShift 5s ease infinite",
                    filter:"drop-shadow(0 2px 12px rgba(99,102,241,0.3))" }}>
                    BADGES
                  </h1>
                </div>

                {/* Rotating word + lines */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, flexWrap:"wrap" }}>
                  <div style={{ height:1, width:44, background:"linear-gradient(90deg,transparent,#6366f1)" }} />
                  <span style={{ fontSize:12, fontWeight:800, letterSpacing:"0.2em" }}>
                    <WordCycler words={["CONQUER.", "COLLECT.", "ASCEND.", "DOMINATE."]} />
                  </span>
                  <div style={{ height:1, flex:1, background:"linear-gradient(90deg,#6366f1,transparent)" }} />
                </div>

                <p style={{ color:"#64748b", fontSize:"clamp(13px, 2vw, 14px)", fontFamily:"'DM Sans',sans-serif",
                  lineHeight:1.65, maxWidth:460, animation:"fadeUp 0.6s ease 0.3s both" }}>
                  Every badge earned is a milestone in your journey.
                  <span style={{ color:"#16a34a", fontWeight:700 }}> {unlocked} unlocked</span> of {allBadges.length} —
                  <span style={{ color:"#4f46e5" }}> keep pushing your limits.</span>
                </p>
              </div>

              {/* Right side */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12, animation:"fadeUp 0.6s ease 0.4s both", minWidth:200 }}>
                {/* XP chip */}
                <div style={{ background:"rgba(255,255,255,0.8)", backdropFilter:"blur(20px)",
                  border:"1px solid rgba(217,119,6,0.2)", borderRadius:16,
                  padding:"14px 22px", textAlign:"right",
                  boxShadow:"0 4px 20px rgba(180,83,9,0.08),inset 0 1px 0 rgba(255,255,255,0.9)" }}>
                  <div style={{ color:"#b45309", fontSize:"clamp(20px, 4vw, 32px)", fontWeight:900, fontFamily:"'Orbitron',monospace",
                    letterSpacing:"-0.04em", lineHeight:1, textShadow:"0 2px 12px rgba(180,83,9,0.2)" }}>
                    <CountUp to={MOCK_USER.xp} dur={1400} />
                  </div>
                  <div style={{ color:"#d9a44a", fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em", fontFamily:"'DM Mono',monospace" }}>
                    Total XP
                  </div>
                </div>
                <button className="sim-btn" onClick={()=>setSimModal(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Simulate Unlock
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12, marginBottom:28,
              animation:"fadeUp 0.6s ease 0.2s both" }}>
              <StatCard label="Unlocked" value={unlocked} color="#16a34a" darkColor="#15803d" delay={0}
                sub={`${Math.round(unlocked/allBadges.length*100)}% complete`}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}/>
              <StatCard label="Locked" value={allBadges.length-unlocked} color="#6366f1" darkColor="#4338ca" delay={80}
                sub="Keep earning XP!"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}/>
              <StatCard label="Gold Badges" value={allBadges.filter(b=>b.tier==="gold").length} color="#d97706" darkColor="#b45309" delay={160}
                sub="Elite tier"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>}/>
              <StatCard label="XP Earned" value={xpFromBadge} color="#7c3aed" darkColor="#5b21b6" delay={240}
                sub="From badges only"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}/>
            </div>

            {/* Sticky-ready filter bar - REMOVED, using only sticky version below */}
          </div>
        </div>

        {/* ══ STICKY FILTER BAR ══ */}
        <div style={{ background:"linear-gradient(180deg,rgba(240,240,255,0.95) 0%,rgba(245,245,255,0.85) 100%)", backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(99,102,241,0.12)", position:"sticky", top:0, zIndex:50,
          boxShadow:"0 4px 24px rgba(99,102,241,0.05)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"14px 24px", display:"flex", gap:8, overflowX:"auto", alignItems:"center" }}>
            <span style={{color:"#94a3b8",fontSize:11,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Filter:</span>
            {FILTERS.map(f => {
              const active=filter===f.key;
              const tierCls=active&&["bronze","silver","gold"].includes(f.key)?`active-${f.key}`:active?"active":"";
              const cnt=f.key==="all"?allBadges.length:f.key==="unlocked"?allBadges.filter(b=>b.unlocked).length:f.key==="locked"?allBadges.filter(b=>!b.unlocked).length:allBadges.filter(b=>b.tier===f.key).length;
              return (
                <button key={f.key} className={`f-btn ${tierCls}`} style={{fontSize:12,padding:"7px 16px",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)"}} onClick={()=>setFilter(f.key)}>
                  {f.label} <span style={{opacity:0.5,fontSize:10,fontFamily:"'DM Mono',monospace",marginLeft:4}}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>

          {/* Section: Progress */}
          <div className="s-div">
            <span style={{ color:"#4f46e5", fontSize:10, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.16em", fontFamily:"'Orbitron',monospace", whiteSpace:"nowrap" }}>◈ Progress</span>
            <div className="s-div-line"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:8 }}>
            <XPBar currentXP={MOCK_USER.xp}/>
            <StreakTracker streakDays={MOCK_USER.streakDays}/>
          </div>

          {/* Section: Badges */}
          <div className="s-div" style={{ marginTop:44 }}>
            <span style={{ color:"#b45309", fontSize:10, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.16em", fontFamily:"'Orbitron',monospace", whiteSpace:"nowrap" }}>◈ Badge Collection</span>
            <div className="s-div-line" style={{ background:"linear-gradient(90deg,rgba(180,83,9,0.3),transparent)" }}/>
          </div>

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:16 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ color:"#e2e8f0", fontSize:11, fontFamily:"'DM Mono',monospace", marginRight:2 }}>Category:</span>
              {CATS.map(c=>(
                <button key={c} className={`c-pill${cat===c?" active":""}`} onClick={()=>setCat(c)}>
                  {c==="all"?"All":c}
                </button>
              ))}
            </div>
            <div style={{ position:"relative" }}>
              <svg style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", transition:"stroke 0.3s" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={sFocused?"#6366f1":"#cbd5e1"} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="s-input" type="text" placeholder="Search badges..."
                value={search} onChange={e=>setSearch(e.target.value)}
                onFocus={()=>setSFocused(true)} onBlur={()=>setSFocused(false)}/>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <span style={{ color:"#cbd5e1", fontSize:12, fontFamily:"'DM Mono',monospace" }}>
              {filtered.length} {filtered.length!==1?"badges":"badge"}
            </span>
            <div style={{ display:"flex", gap:14 }}>
              {[{k:"unlocked",c:"#16a34a"},{k:"locked",c:"#e2e8f0"}].map(x=>(
                <div key={x.k} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:x.c }}/>
                  <span style={{ color:"#cbd5e1", fontSize:10, fontFamily:"'DM Mono',monospace", textTransform:"capitalize" }}>{x.k}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length>0 ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(clamp(140px, calc((100vw - 48px) / 3), 232px), 1fr))", gap:14 }}>
              {filtered.map((b,i)=>(
                <div key={b.id} className="c-grid-item" style={{ animationDelay:`${i*0.055}s` }}>
                  <BadgeCard badge={b} onSelect={setSelBadge}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(99,102,241,0.06)",
                border:"1px solid rgba(99,102,241,0.1)", display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div style={{ color:"#c7d2fe", fontSize:17, fontWeight:700, fontFamily:"'Orbitron',monospace", marginBottom:8 }}>No Results</div>
              <div style={{ color:"#e2e8f0", fontSize:13 }}>Try a different filter or search term.</div>
            </div>
          )}

          {/* Bottom motivational banner */}
          {filtered.length>0&&nextUnlocked&&(
            <div style={{ marginTop:48, padding:"24px 30px",
              background:"linear-gradient(135deg,rgba(255,255,255,0.7),rgba(240,240,255,0.5))",
              backdropFilter:"blur(20px)",
              border:"1px solid rgba(99,102,241,0.12)", borderRadius:20,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16,
              boxShadow:"0 4px 24px rgba(99,102,241,0.06),inset 0 1px 0 rgba(255,255,255,0.8)",
              transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor:"pointer", animation:"nextGoalGlow 3s ease-in-out infinite",
              position:"relative", overflow:"hidden"
            }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>

              {/* Shimmer effect */}
              <div style={{
                position:"absolute", top:0, left:0, right:0, bottom:0,
                background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)",
                animation:"bcShimmerMove 2s ease-in-out infinite",
                pointerEvents:"none"
              }}/>

              <div style={{position:"relative",zIndex:1}}>
                <div style={{ color:"#4f46e5", fontSize:10, fontWeight:700, letterSpacing:"0.16em",
                  textTransform:"uppercase", fontFamily:"'Orbitron',monospace", marginBottom:6 }}>◈ Next Goal</div>
                <div style={{ color:"#1e1b4b", fontSize:15, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>
                  Earn <span style={{ color:"#d97706", fontFamily:"'Orbitron',monospace", fontWeight:900 }}>
                    {Math.max(0, nextUnlocked.xpRequired - MOCK_USER.xp).toLocaleString()} XP
                  </span> more to unlock <span style={{ color:"#4f46e5" }}>{nextUnlocked.name}</span>
                </div>
                <div style={{ color:"#94a3b8", fontSize:12, marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>
                  {nextUnlocked.description}
                </div>
              </div>
              <div style={{ width:48, height:48, borderRadius:14,
                background:"rgba(99,102,241,0.12)", border:"1.5px solid rgba(99,102,241,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#6366f1", fontSize:20, fontFamily:"'Orbitron',monospace", fontWeight:800,
                boxShadow:"0 4px 16px rgba(99,102,241,0.1)",
                transition:"all 0.3s ease", position:"relative", zIndex:1,
                animation:"bcBadgeFloat 3s ease-in-out infinite"
              }}>?</div>
            </div>
          )}
        </div>
      </div>

      {selBadge&&<BadgeUnlockModal badge={selBadge} onClose={()=>setSelBadge(null)}/>}
      {simModal &&<BadgeUnlockModal badge={DEMO}     onClose={()=>setSimModal(false)}/>}
      <Toast/>
    </>
  );
}

export default function BadgesPage() {
  return <ToastProvider><BadgesPageInner/></ToastProvider>;
}