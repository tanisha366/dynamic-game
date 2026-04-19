// src/components/rewards/BadgeCard.jsx
// Apr 22-23 brief:
// - BadgeCard: larger card version
// - Rarity pill (Common/Rare/Epic/Legendary)
// - Earned: full color, date earned shown below
// - Locked: grayscale, 'Complete X to unlock'
// - Hover on locked: tooltip with exact unlock condition
// - 3D tilt, ripple, prismatic top bar for legendary

import { useState, useRef } from "react";
import BadgeIcon from "./BadgeIcon";
import { RARITY_CONFIG } from "../../mocks/badgeMock";

const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : null;

function RarityPill({ rarity }) {
  const cfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
  return (
    <span style={{ background:cfg.pillBg, border:`1px solid ${cfg.pillBorder}`,
      color:cfg.textColor, fontSize:9, fontWeight:800, padding:"3px 10px",
      borderRadius:999, textTransform:"uppercase", letterSpacing:"0.12em",
      fontFamily:"'DM Mono',monospace" }}>
      {cfg.label}
    </span>
  );
}

// Locked tooltip showing exact condition
function LockedTooltip({ badge, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position:"absolute", bottom:"calc(100% + 10px)", left:"50%", transform:"translateX(-50%)",
      background:"rgba(30,27,75,0.96)", backdropFilter:"blur(12px)",
      border:"1px solid rgba(99,102,241,0.2)", borderRadius:12, padding:"10px 14px",
      width:220, zIndex:100, boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
      animation:"tooltipIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ color:"#e2e8f0", fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>
        How to unlock:
      </div>
      <div style={{ color:"#94a3b8", fontSize:11, lineHeight:1.55, fontFamily:"'DM Sans',sans-serif" }}>
        {badge.unlockConditionDetail}
      </div>
      {badge.earnedProgress > 0 && badge.earnedProgress < badge.totalRequired && (
        <div style={{ marginTop:8 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
            <span style={{ color:"#6366f1",fontSize:10,fontFamily:"'DM Mono',monospace" }}>Progress</span>
            <span style={{ color:"#6366f1",fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700 }}>
              {badge.earnedProgress}/{badge.totalRequired}
            </span>
          </div>
          <div style={{ height:3,background:"rgba(99,102,241,0.15)",borderRadius:999,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${Math.min(100,(badge.earnedProgress/badge.totalRequired)*100)}%`,
              background:"#6366f1",borderRadius:999 }}/>
          </div>
        </div>
      )}
      {/* Tooltip arrow */}
      <div style={{ position:"absolute",bottom:-5,left:"50%",
        width:10,height:10,background:"rgba(30,27,75,0.96)",
        border:"1px solid rgba(99,102,241,0.2)",borderRadius:2,
        transform:"translateX(-50%) rotate(45deg)",borderTop:"none",borderLeft:"none" }}/>
    </div>
  );
}

export default function BadgeCard({ badge, onSelect }) {
  const [hov, setHov]         = useState(false);
  const [tilt, setTilt]       = useState({x:0,y:0});
  const [ripples, setRipples] = useState([]);
  const [tooltip, setTooltip] = useState(false);
  const ref = useRef(null);
  const cfg = RARITY_CONFIG[badge.rarity] || RARITY_CONFIG.common;

  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-r.top-r.height/2)/(r.height/2))*-5, y:((e.clientX-r.left-r.width/2)/(r.width/2))*5 });
  };

  const onClick = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(r=>r.id!==id)),700);
    if (badge.earned && onSelect) onSelect(badge);
    if (!badge.earned) setTooltip(v=>!v);
  };

  const cardBg = badge.earned
    ? hov ? cfg.gradient.replace("135deg","145deg") : "rgba(255,255,255,0.82)"
    : "rgba(248,248,252,0.7)";

  // Next badge progress (shown if locked + has partial progress)
  const hasProgress = !badge.earned && badge.earnedProgress > 0 && badge.earnedProgress < badge.totalRequired;
  const progressPct = hasProgress ? Math.min(100, Math.round((badge.earnedProgress / badge.totalRequired) * 100)) : 0;

  return (
    <>
      <style>{`
        @keyframes bcRipple  { 0%{width:0;height:0;opacity:0.3} 100%{width:420px;height:420px;opacity:0} }
        @keyframes bcIn      { from{opacity:0;transform:translateY(22px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bcHint    { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes bcXpPop   { 0%{transform:scale(1)} 50%{transform:scale(1.16)} 100%{transform:scale(1)} }
        @keyframes bcPrisma  { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes tooltipIn { from{opacity:0;transform:translateX(-50%) translateY(6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div ref={ref}
        style={{
          background:cardBg, backdropFilter:"blur(20px)",
          border:`1px solid ${hov&&badge.earned?cfg.pillBorder:"rgba(0,0,0,0.06)"}`,
          borderRadius:18, padding:22,
          display:"flex",flexDirection:"column",gap:15,
          cursor:badge.earned?"pointer":"default",
          opacity:badge.earned?1:0.65,
          position:"relative",overflow:"visible",
          boxShadow:hov&&badge.earned
            ?`0 20px 52px rgba(0,0,0,0.11),0 0 0 1px ${cfg.pillBorder},0 4px 60px ${cfg.pillBg}`
            :"0 4px 18px rgba(0,0,0,0.06),0 1px 0 rgba(255,255,255,0.9) inset",
          transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hov&&badge.earned?"translateY(-6px)":""}`,
          transition:hov?"box-shadow 0.2s,border-color 0.2s":"all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          animation:"bcIn 0.5s ease both",
        }}
        onMouseEnter={()=>setHov(true)}
        onMouseMove={badge.earned?onMove:undefined}
        onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}}
        onClick={onClick}>

        {/* Ripples */}
        {ripples.map(r=>(
          <div key={r.id} style={{position:"absolute",left:r.x,top:r.y,transform:"translate(-50%,-50%)",
            borderRadius:"50%",background:`${cfg.stroke}15`,
            animation:"bcRipple 0.7s ease-out forwards",pointerEvents:"none",zIndex:0,overflow:"hidden"}}/>
        ))}

        {/* Legendary prismatic top bar */}
        {hov&&badge.rarity==="legendary"&&badge.earned&&(
          <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,borderRadius:"18px 18px 0 0",
            background:"linear-gradient(90deg,#f59e0b,#8b5cf6,#3b82f6,#22c55e,#f59e0b)",
            backgroundSize:"300% auto",animation:"bcPrisma 2.5s linear infinite",pointerEvents:"none"}}/>
        )}

        {/* Hover glow */}
        {hov&&badge.earned&&<div style={{position:"absolute",top:-40,right:-40,width:140,height:140,
          borderRadius:"50%",background:cfg.pillBg,filter:"blur(42px)",pointerEvents:"none",zIndex:0}}/>}

        {/* Locked tooltip */}
        {!badge.earned && <LockedTooltip badge={badge} visible={tooltip||hov}/>}

        {/* Top: icon + pills */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1}}>
          <BadgeIcon badge={badge} size="md" earned={badge.earned} animated={badge.earned}/>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <RarityPill rarity={badge.rarity}/>
            {badge.earned
              ? <span style={{background:"rgba(22,163,74,0.07)",border:"1px solid rgba(22,163,74,0.2)",
                  color:"#15803d",fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:999,
                  fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:3}}>
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#15803d"/></svg>
                  Earned
                </span>
              : <span style={{background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.07)",
                  color:"#94a3b8",fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:999,
                  fontFamily:"'DM Sans',sans-serif"}}>
                  Locked
                </span>}
          </div>
        </div>

        {/* Name + desc */}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{color:"#1e1b4b",fontSize:15,fontWeight:800,fontFamily:"'DM Sans',sans-serif",
            marginBottom:5,letterSpacing:"-0.01em"}}>
            {badge.name}
          </div>
          <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.55,fontFamily:"'DM Sans',sans-serif"}}>
            {badge.description}
          </div>
        </div>

        {/* Earned date OR unlock condition */}
        <div style={{position:"relative",zIndex:1}}>
          {badge.earned && badge.earnedOn
            ? <div style={{display:"flex",alignItems:"center",gap:5,color:"#64748b",fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                Earned on {fmt(badge.earnedOn)}
              </div>
            : <div style={{color:"#94a3b8",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>
                {badge.unlockCondition}
              </div>}
        </div>

        {/* Progress bar for close-to-unlock locked badges */}
        {hasProgress && (
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"#64748b",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Progress</span>
              <span style={{color:"#6366f1",fontSize:10,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>
                {badge.earnedProgress} / {badge.totalRequired}
              </span>
            </div>
            <div style={{height:4,background:"rgba(99,102,241,0.1)",borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progressPct}%`,
                background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:999,
                boxShadow:"0 0 6px rgba(99,102,241,0.4)",transition:"width 1s ease"}}/>
            </div>
          </div>
        )}

        {/* Footer: XP */}
        <div style={{paddingTop:12,borderTop:"1px solid rgba(0,0,0,0.05)",display:"flex",
          justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:5,animation:hov&&badge.earned?"bcXpPop 0.4s ease":"none"}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{color:"#b45309",fontSize:12,fontWeight:800,fontFamily:"'DM Mono',monospace"}}>
              +{badge.xpReward} XP
            </span>
          </div>
          <span style={{color:"#cbd5e1",fontSize:10,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>
            {badge.rarity}
          </span>
        </div>

        {/* Hover hint for earned */}
        {hov&&badge.earned&&(
          <div style={{position:"absolute",bottom:14,left:"50%",
            background:"linear-gradient(135deg,#4f46e5,#6366f1)",
            color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",
            borderRadius:999,whiteSpace:"nowrap",zIndex:2,
            boxShadow:"0 4px 12px rgba(99,102,241,0.35)",
            animation:"bcHint 0.25s ease forwards"}}>
            View Details →
          </div>
        )}
      </div>
    </>
  );
}