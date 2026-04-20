// src/pages/BadgesPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { badges, MOCK_USER, RARITY } from "../mocks/badgeMock";
import BadgeCard from "../components/rewards/BadgeCard";
import BadgeUnlockModal from "../components/rewards/BadgeUnlockModal";
import XPBar from "../components/rewards/XPBar";
import StreakTracker from "../components/rewards/StreakTracker";
import { ToastContainer } from "../components/rewards/Toast";
import { ToastProvider, useToast } from "../context/ToastContext";

/* ══════════════ ANIMATED HEX-GRID + AURORA CANVAS ══════════════ */
function MysticBG() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const HEX = 36, HW = HEX * 2, HH = Math.sqrt(3) * HEX;
    function hex(cx, cy, s) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + s * Math.cos(a), cy + s * Math.sin(a));
        else ctx.lineTo(cx + s * Math.cos(a), cy + s * Math.sin(a));
      }
      ctx.closePath();
    }

    const AURORAS = [{ r: 108, g: 99, b: 255, ph: 0 }, { r: 139, g: 92, b: 246, ph: 1.3 }, { r: 59, g: 130, b: 246, ph: 2.6 }, { r: 245, g: 158, b: 11, ph: 3.9 }];
    const ORBS = [{ cx: .1, cy: .15, ra: 260, r: 108, g: 99, b: 255, sp: .28, ph: 0 }, { cx: .88, cy: .12, ra: 200, r: 139, g: 92, b: 246, sp: .38, ph: 1.5 }, { cx: .82, cy: .8, ra: 220, r: 59, g: 130, b: 246, sp: .22, ph: 3 }, { cx: .04, cy: .85, ra: 180, r: 245, g: 158, b: 11, sp: .32, ph: 4.5 }];
    const RUNES = ["⬡", "◈", "⟡", "✦", "⬢", "◇", "⊕", "⋈"];
    const runes = Array.from({ length: 14 }, (_, i) => ({ x: Math.random() * 100, y: Math.random() * 100, vx: (Math.random() - .5) * .007, vy: -.005 - Math.random() * .007, rune: RUNES[i % RUNES.length], size: 10 + Math.random() * 12, alpha: .03 + Math.random() * .06, ph: Math.random() * Math.PI * 2, sp: .3 + Math.random() * .45 }));

    function draw() {
      if (!ctx) return;
      t += .007;
      ctx.clearRect(0, 0, W, H);
      // Aurora bands
      for (let idx = 0; idx < AURORAS.length; idx++) {
        const a = AURORAS[idx];
        const bY = H * (.1 + idx * .24) + Math.sin(t * .45 + a.ph) * H * .05;
        const gr = ctx.createLinearGradient(0, bY - 70, 0, bY + 70);
        gr.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0)`);
        gr.addColorStop(.5, `rgba(${a.r},${a.g},${a.b},0.044)`);
        gr.addColorStop(1, `rgba(${a.r},${a.g},${a.b},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.moveTo(0, bY + Math.sin(t * .6) * 22);
        for (let s = 0; s <= 10; s++) ctx.lineTo((s / 10) * W, bY + Math.sin(t * .6 + s * .8) * 18 + Math.sin(t * 1.1 + s * 1.3) * 10);
        ctx.lineTo(W, bY + 70);
        ctx.lineTo(0, bY + 70);
        ctx.closePath();
        ctx.fill();
      }
      // Hex grid
      const cols = Math.ceil(W / (HW * .75)) + 2, rows = Math.ceil(H / HH) + 2;
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * HW * .75, cy = row * HH + (col % 2 === 0 ? 0 : HH / 2);
          const dx = cx - W / 2, dy = cy - H / 2, dist = Math.sqrt(dx * dx + dy * dy);
          const pulse = Math.sin(t * 1.1 - dist * .006) * .5 + .5;
          hex(cx, cy, HEX - 2);
          ctx.strokeStyle = `rgba(108,99,255,${.018 + pulse * .04})`;
          ctx.lineWidth = .65;
          ctx.stroke();
          if (Math.sin(t * .35 + col * 1.7 + row * 2.3) > .97) {
            ctx.fillStyle = `rgba(108,99,255,${.025 + pulse * .04})`;
            ctx.fill();
          }
        }
      }
      // Orbs
      for (const o of ORBS) {
        const ox = W * o.cx + Math.sin(t * o.sp + o.ph) * 52, oy = H * o.cy + Math.cos(t * o.sp * .7 + o.ph) * 36;
        const gr = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.ra);
        gr.addColorStop(0, `rgba(${o.r},${o.g},${o.b},0.06)`);
        gr.addColorStop(1, `rgba(${o.r},${o.g},${o.b},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(ox, oy, o.ra, 0, Math.PI * 2);
        ctx.fill();
      }
      // Runes
      for (const r of runes) {
        const rx = (r.x / 100) * W, ry = (r.y / 100) * H, w = Math.sin(t * r.sp + r.ph) * 7;
        const a = r.alpha * (.5 + Math.sin(t * r.sp * 1.4 + r.ph) * .5);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = "rgba(108,99,255,1)";
        ctx.font = `${r.size}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(r.rune, rx + w, ry + w * .5);
        ctx.restore();
        r.x += r.vx * 100;
        r.y += r.vy * 100;
        if (r.y < -5) {
          r.y = 105;
          r.x = Math.random() * 100;
        }
        if (r.x < -5 || r.x > 105) r.vx *= -1;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ══════ COUNT UP ══════ */
function CountUp({ to, dur = 950, delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [to, dur, delay]);
  return <>{v.toLocaleString()}</>;
}

/* ══════ WORD CYCLER ══════ */
function Cycle({ words }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    let timeoutId = null;
    const interval = setInterval(() => {
      setVis(false);
      timeoutId = setTimeout(() => {
        setIdx(i => (i + 1) % words.length);
        setVis(true);
      }, 360);
    }, 2100);
    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [words]);
  return <span style={{ display: "inline-block", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(-8px)", transition: "all .32s ease", color: "var(--primary)", fontFamily: "'DM Mono',monospace", textShadow: "var(--shadow-glow)" }}>{words[idx]}</span>;
}

/* ══════ NEXT BADGE PROGRESS ══════ */
function NextBadgeSection({ badges }) {
  const next = badges.filter(b => !b.earned && b.total > 0).map(b => ({ ...b, pct: b.progress / b.total })).sort((a, b) => b.pct - a.pct)[0];
  if (!next) return null;
  const rarityDef = RARITY[next.rarity] || RARITY.common;
  const pct = Math.min(100, Math.round((next.progress / next.total) * 100));
  return (
    <div style={{
      background: "linear-gradient(135deg,#1A1A2E 0%,#13132a 100%)",
      border: "1px solid rgba(108,99,255,0.18)", borderRadius: 20, padding: "20px 24px",
      boxShadow: "var(--shadow-card)", animation: "sIn .6s ease .2s both"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", boxShadow: "var(--shadow-glow)", animation: "db 1.5s ease-in-out infinite" }} />
        <span style={{ color: "var(--primary)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: "'DM Mono',monospace" }}>
          Next Goal — Closest Badge
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: `${rarityDef.strokeHex}18`, border: `1.5px solid ${rarityDef.strokeHex}33`,
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${rarityDef.glowHex}`, flexShrink: 0
        }}>
          <span style={{ color: rarityDef.strokeHex, fontSize: 22, fontWeight: 900, fontFamily: "'DM Mono',monospace" }}>?</span>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <div>
              <div style={{ color: "var(--text)", fontSize: 15, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{next.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>{next.unlockCondition}</div>
            </div>
            <span style={{ color: rarityDef.strokeHex, fontSize: 14, fontWeight: 900, fontFamily: "'DM Mono',monospace" }}>{next.progress}/{next.total}</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{
              height: "100%", width: `${pct}%`, borderRadius: 999,
              background: `linear-gradient(90deg,${rarityDef.strokeHex},${rarityDef.strokeHex}bb)`,
              boxShadow: `0 0 10px ${rarityDef.glowHex}`, transition: "width 1.3s cubic-bezier(0.34,1.56,0.64,1)"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ color: "var(--text-muted)", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{pct}% complete</span>
            <span style={{ color: "var(--accent-gold)", fontSize: 10, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>+{next.xpReward} XP on unlock</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ MAIN PAGE ══════════════════════ */
function Inner() {
  const { showToast } = useToast();
  const [tab, setTab] = useState("all");
  const [simBadge, setSimBadge] = useState(null);
  const [selBadge, setSelBadge] = useState(null);
  const [pageIn, setPageIn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPageIn(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Listen for triggerBadgeUnlock from other pages (Nimrit)
  useEffect(() => {
    const h = e => setSimBadge(e.detail);
    window.addEventListener("badge:unlock", h);
    return () => window.removeEventListener("badge:unlock", h);
  }, []);

  const earnedCount = badges.filter(b => b.earned).length;
  const filtered = useMemo(() => tab === "earned" ? badges.filter(b => b.earned) : tab === "locked" ? badges.filter(b => !b.earned) : badges, [tab]);

  function handleSim() {
    const unlocked = badges.filter(b => !b.earned);
    setSimBadge(unlocked[Math.floor(Math.random() * unlocked.length)] || badges[0]);
  }
  function testToasts() {
    showToast("Quiz saved successfully!", "success");
    setTimeout(() => showToast("Points earned", "points", { points: MOCK_USER.totalPoints }), 600);
    setTimeout(() => showToast("New streak:", "streak", { streak: MOCK_USER.streakDays }), 1200);
    setTimeout(() => showToast("Quiz complete!", "info"), 1800);
  }

  const TABS = [{ key: "all", label: "All", count: badges.length }, { key: "earned", label: "Earned", count: earnedCount }, { key: "locked", label: "Locked", count: badges.length - earnedCount }];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{min-height:100vh;background:var(--bg)}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0a12}::-webkit-scrollbar-thumb{background:linear-gradient(var(--primary),#8B5CF6);border-radius:999px}

        @keyframes pageIn  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes heroA   { from{opacity:0;transform:translateY(-24px) scale(.88)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes heroB   { from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes eyeIn   { from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes gradSh  { 0%,100%{background-position:0% 50%}50%{background-position:200% 50%} }
        @keyframes db      { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.55)} }
        @keyframes sIn     { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes divLine { from{width:0;opacity:0}to{width:100%;opacity:1} }
        @keyframes cGrid   { from{opacity:0;transform:translateY(26px) rotateX(5deg)}to{opacity:1;transform:translateY(0) rotateX(0)} }
        @keyframes prisma  { 0%{background-position:0% 50%}100%{background-position:300% 50%} }
        @keyframes tabPop  { 0%{transform:scale(1)}45%{transform:scale(1.08)}100%{transform:scale(1)} }
        @keyframes statIn  { from{opacity:0;transform:translateY(16px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes scan    { 0%{top:-1px;opacity:.5}100%{top:100%;opacity:.5} }

        .tab-btn { padding:9px 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);color:var(--text-muted);font-size:13px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;transition:all .25s cubic-bezier(0.34,1.56,0.64,1);display:flex;align-items:center;gap:7px;backdrop-filter:blur(8px); }
        .tab-btn:hover { color:var(--primary);border-color:var(--border-hover);transform:translateY(-2px);background:rgba(108,99,255,0.06);box-shadow:0 4px 14px rgba(108,99,255,0.12); }
        .tab-btn.active { background:var(--primary-dim);border-color:rgba(108,99,255,0.5);color:#a5a0ff;box-shadow:var(--shadow-glow),inset 0 1px 0 rgba(255,255,255,0.05);animation:tabPop .3s ease; }
        .tab-count { display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;padding:0 6px;border-radius:999px;background:rgba(108,99,255,0.15);color:var(--primary);font-size:10px;font-weight:800;font-family:'DM Mono',monospace; }
        .tab-btn.active .tab-count { background:rgba(108,99,255,0.25); }

        .stat-item { transition:all .3s cubic-bezier(0.34,1.56,0.64,1); }
        .stat-item:hover { transform:translateY(-5px) scale(1.03)!important; }

        .sim-btn { display:inline-flex;align-items:center;gap:9px;padding:12px 24px;border-radius:var(--radius-card);background:rgba(255,215,0,0.07);border:1px solid rgba(255,215,0,0.22);color:var(--accent-gold);font-size:13px;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .25s cubic-bezier(0.34,1.56,0.64,1);backdrop-filter:blur(8px); }
        .sim-btn:hover { transform:translateY(-3px) scale(1.04);box-shadow:var(--shadow-gold),0 10px 28px rgba(255,215,0,0.12);border-color:rgba(255,215,0,0.5); }

        .sdiv  { display:flex;align-items:center;gap:14px;margin:36px 0 18px; }
        .sline { flex:1;height:1px;background:linear-gradient(90deg,var(--primary-dim),transparent);animation:divLine .8s ease .3s both; }
        .sgold { background:linear-gradient(90deg,rgba(255,215,0,0.22),transparent)!important; }

        .cgrid-item { animation:cGrid .5s cubic-bezier(0.34,1.2,0.64,1) both;transform-origin:center bottom; }
      `}</style>

      <MysticBG />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "var(--bg)" }} />

      <div style={{
        minHeight: "100vh", color: "var(--text)", fontFamily: "'DM Sans',sans-serif",
        position: "relative", zIndex: 1, paddingBottom: 100,
        opacity: pageIn ? 1 : 0, transform: pageIn ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .5s ease,transform .5s ease"
      }}>

        {/* ═══════════ HERO HEADER ═══════════ */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg,rgba(15,14,23,0.9) 0%,rgba(10,10,18,0.7) 100%)",
          borderBottom: "1px solid rgba(108,99,255,0.1)"
        }}>

          {/* Prismatic top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg,#6C63FF,#8B5CF6,#3B82F6,#F59E0B,#22c55e,#6C63FF)",
            backgroundSize: "300% auto", animation: "prisma 4s linear infinite"
          }} />
          {/* Scanner line */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg,transparent,rgba(108,99,255,0.2),transparent)",
            animation: "scan 6s ease-in-out infinite", pointerEvents: "none"
          }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 0", position: "relative", zIndex: 1 }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 12, fontFamily: "'DM Mono',monospace" }}>
              {["Dashboard", "Rewards", "My Achievements"].map((s, i, a) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: i === a.length - 1 ? "var(--primary)" : "var(--text-faint)", fontWeight: i === a.length - 1 ? 700 : 400, cursor: i < a.length - 1 ? "pointer" : "default", transition: "color .2s" }}
                    onMouseEnter={e => { if (i < a.length - 1) e.target.style.color = "var(--text-muted)"; }}
                    onMouseLeave={e => { if (i < a.length - 1) e.target.style.color = "var(--text-faint)"; }}>
                    {s}
                  </span>
                  {i < a.length - 1 && <span style={{ color: "var(--text-faint)" }}>›</span>}
                </span>
              ))}
            </div>

            {/* Hero row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 34 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                {/* Eyebrow */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--primary-dim)", border: "1px solid rgba(108,99,255,0.25)",
                  borderRadius: 999, padding: "5px 14px", marginBottom: 18,
                  animation: "eyeIn .6s ease both", backdropFilter: "blur(8px)"
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", boxShadow: "var(--shadow-glow)", animation: "db 1.5s ease-in-out infinite" }} />
                  <span style={{ color: "var(--primary)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'DM Mono',monospace" }}>
                    Dynamic Gamification · Rewards
                  </span>
                </div>

                {/* Big title */}
                <h1 style={{
                  fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 900, fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 4px", color: "var(--text)",
                  textShadow: "0 2px 30px rgba(108,99,255,0.2)", animation: "heroA .7s cubic-bezier(0.34,1.56,0.64,1) both"
                }}>
                  MY
                </h1>
                <h1 style={{
                  fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 900, fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 14px",
                  background: "linear-gradient(135deg,var(--primary) 0%,#8B5CF6 35%,#3B82F6 65%,var(--accent-gold) 100%)",
                  backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  animation: "heroB .7s cubic-bezier(0.34,1.56,0.64,1) .08s both,gradSh 5s ease infinite",
                  filter: "drop-shadow(0 2px 12px rgba(108,99,255,0.3))"
                }}>
                  ACHIEVEMENTS
                </h1>

                {/* Rotating word + line */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ height: 1, width: 42, background: "linear-gradient(90deg,transparent,var(--primary))" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em" }}>
                    <Cycle words={["CONQUER.", "COLLECT.", "ASCEND.", "LEGEND."]} />
                  </span>
                  <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,var(--primary),transparent)" }} />
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: 14, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.65, maxWidth: 460, animation: "fadeUp .6s ease .3s both" }}>
                  <span style={{ color: "#22c55e", fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{earnedCount}</span>
                  <span> / {badges.length} badges earned — </span>
                  <span style={{ color: "var(--primary)" }}>keep pushing your limits.</span>
                </p>
              </div>

              {/* Right */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, animation: "fadeUp .6s ease .4s both" }}>
                {/* XP chip */}
                <div style={{
                  background: "linear-gradient(135deg,rgba(26,26,46,0.9),rgba(20,18,30,0.9))", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,215,0,0.2)", borderRadius: 16, padding: "14px 22px", textAlign: "right",
                  boxShadow: "var(--shadow-card),var(--shadow-gold)"
                }}>
                  <div style={{ color: "var(--accent-gold)", fontSize: 30, fontWeight: 900, fontFamily: "'DM Mono',monospace", letterSpacing: "-0.04em", lineHeight: 1, textShadow: "0 2px 16px rgba(255,215,0,0.35)" }}>
                    <CountUp to={MOCK_USER.totalPoints} dur={1400} />
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'DM Mono',monospace" }}>Total XP</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button className="sim-btn" onClick={handleSim}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5,3 19,12 5,21" /></svg>
                    Simulate Unlock
                  </button>
                  <button onClick={testToasts}
                    style={{ padding: "12px 18px", borderRadius: "var(--radius-card,14px)", background: "rgba(108,99,255,0.08)", border: "1px solid var(--border-hover)", color: "var(--primary)", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all .2s", backdropFilter: "blur(8px)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.16)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(108,99,255,0.08)"; }}>
                    Test Toasts
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
              {[
                { label: "Earned", value: earnedCount, color: "#22c55e", delay: 0 },
                { label: "Locked", value: badges.length - earnedCount, color: "#6C63FF", delay: 80 },
                { label: "Streak", value: MOCK_USER.streakDays, color: "#ea580c", delay: 160 },
                { label: "Total XP", value: MOCK_USER.totalPoints, color: "#FFD700", delay: 240 },
              ].map(s => (
                <div key={s.label} className="stat-item"
                  style={{
                    background: "linear-gradient(145deg,#1A1A2E,#13132a)", backdropFilter: "blur(16px)",
                    border: `1px solid ${s.color}22`, borderRadius: 16, padding: "18px 20px",
                    boxShadow: `var(--shadow-card),0 0 20px ${s.color}0d`,
                    animation: `statIn .6s cubic-bezier(0.34,1.56,0.64,1) ${s.delay}ms both`
                  }}>
                  <div style={{ color: s.color, fontSize: 28, fontWeight: 900, fontFamily: "'DM Mono',monospace", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4, textShadow: `0 0 16px ${s.color}55` }}>
                    <CountUp to={s.value} delay={s.delay} />
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans',sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8 }}>
              {TABS.map(tb => (
                <button key={tb.key} className={`tab-btn${tab === tb.key ? " active" : ""}`} onClick={() => setTab(tb.key)}>
                  {tb.label}<span className="tab-count">{tb.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ BODY ═══════════ */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

          {/* Progress */}
          <div className="sdiv">
            <span style={{ color: "var(--primary)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>◈ Progress</span>
            <div className="sline" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "sIn .6s ease .1s both" }}>
            <XPBar totalPoints={MOCK_USER.totalPoints} />
            <StreakTracker streakDays={MOCK_USER.streakDays} />
          </div>

          {/* Next badge */}
          <div className="sdiv" style={{ marginTop: 38 }}>
            <span style={{ color: "var(--accent-gold)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>◈ Next Goal</span>
            <div className="sline sgold" />
          </div>
          <NextBadgeSection badges={badges} />

          {/* Badge collection */}
          <div className="sdiv" style={{ marginTop: 40 }}>
            <span style={{ color: "#8B5CF6", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>◈ Badge Collection</span>
            <div className="sline" style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.28),transparent)" }} />
          </div>

          {/* Locked info */}
          {tab === "locked" && (
            <div style={{
              background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.14)", borderRadius: 12,
              padding: "12px 18px", marginBottom: 18, color: "var(--text-muted)", fontSize: 13, fontFamily: "'DM Sans',sans-serif",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Hover over any locked badge to reveal the <strong style={{ color: "var(--primary)" }}> exact unlock condition</strong>.
            </div>
          )}

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {filtered.map((b, i) => (
              <div key={b.id} className="cgrid-item" style={{ animationDelay: `${i * .06}s` }}>
                <BadgeCard badge={b} onSelect={setSelBadge} />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ color: "var(--text-faint)", fontSize: 17, fontWeight: 700, fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>Nothing here yet</div>
              <div style={{ color: "var(--text-faint)", fontSize: 13 }}>Keep learning to unlock badges!</div>
            </div>
          )}
        </div>
      </div>

      {simBadge && <BadgeUnlockModal badge={simBadge} onClose={() => { setSimBadge(null); window.dispatchEvent(new Event("badge:dismissed")); }} />}
      {selBadge && <BadgeUnlockModal badge={selBadge} onClose={() => setSelBadge(null)} />}
      <ToastContainer />
    </>
  );
}

export default function BadgesPage() {
  return <ToastProvider><Inner /></ToastProvider>;
}