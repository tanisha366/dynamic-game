// src/components/rewards/BadgeCard.jsx
import { useState, useRef } from "react";
import BadgeIcon from "./BadgeIcon";
import { RARITY } from "../../mocks/badgeMock";

const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : null;

function LockedTooltip({ badge, visible }) {
  const r = RARITY[badge.rarity] ?? RARITY.common;
  if (!visible) return null;
  const pct = badge.total>0 ? Math.min(100,Math.round((badge.progress/badge.total)*100)) : 0;
  return (
    <>
      <style>{`@keyframes ttIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <div style={{position:"absolute",bottom:"calc(100% + 12px)",left:"50%",transform:"translateX(-50%)",
        background:"linear-gradient(135deg,#1A1A2E,#0F0E17)",
        border:`1px solid ${r.strokeHex}33`,borderRadius:14,padding:"14px 16px",width:230,
        zIndex:200,boxShadow:`0 12px 40px rgba(0,0,0,0.6),0 0 20px ${r.glowHex}`,
        animation:"ttIn .22s cubic-bezier(0.34,1.56,0.64,1) both"}}>
        <div style={{color:"var(--text)",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>
          How to unlock:
        </div>
        <div style={{color:"var(--text-muted)",fontSize:11,lineHeight:1.55,fontFamily:"'DM Sans',sans-serif",marginBottom:badge.progress>0?10:0}}>
          {badge.unlockDetail}
        </div>
        {badge.progress>0&&badge.progress<badge.total&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"var(--text-muted)",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Progress</span>
              <span style={{color:r.strokeHex,fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{badge.progress}/{badge.total}</span>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:r.strokeHex,borderRadius:999}}/>
            </div>
          </>
        )}
        {/* Arrow */}
        <div style={{position:"absolute",bottom:-5,left:"50%",width:10,height:10,
          background:"#0F0E17",border:`1px solid ${r.strokeHex}33`,
          transform:"translateX(-50%) rotate(45deg)",borderTop:"none",borderLeft:"none"}}/>
      </div>
    </>
  );
}

export default function BadgeCard({ badge, onSelect }) {
  const [hov, setHov]         = useState(false);
  const [tilt, setTilt]       = useState({x:0,y:0});
  const [ripples, setRipples] = useState([]);
  const [tooltip, setTooltip] = useState(false);
  const ref = useRef(null);
  const r = RARITY[badge.rarity] ?? RARITY.common;
  const hasProgress = !badge.earned && badge.progress > 0 && badge.progress < badge.total;
  const pct = hasProgress ? Math.min(100,Math.round((badge.progress/badge.total)*100)) : 0;

  const onMove = e => {
    if (!ref.current) return;
    const b = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-b.top-b.height/2)/(b.height/2))*-5, y:((e.clientX-b.left-b.width/2)/(b.width/2))*5 });
  };

  const onClick = e => {
    if (!ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(p=>[...p,{id,x:e.clientX-b.left,y:e.clientY-b.top}]);
    setTimeout(()=>setRipples(p=>p.filter(r=>r.id!==id)),700);
    if (badge.earned && onSelect) onSelect(badge);
    else setTooltip(v=>!v);
  };

  return (
    <>
      <style>{`
        @keyframes bcRip  { 0%{width:0;height:0;opacity:.3}100%{width:420px;height:420px;opacity:0} }
        @keyframes bcIn   { from{opacity:0;transform:translateY(22px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bcHint { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes bcXp   { 0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)} }
        @keyframes bcPris { 0%{background-position:0% 50%}100%{background-position:300% 50%} }
      `}</style>

      <div ref={ref}
        style={{
          background: hov&&badge.earned
            ? `linear-gradient(145deg,rgba(26,26,46,0.98) 0%,rgba(${badge.rarity==="legendary"?"26,18,0":badge.rarity==="epic"?"21,15,41":badge.rarity==="rare"?"15,25,41":"26,26,46"},0.98) 100%)`
            : "linear-gradient(145deg,#1A1A2E 0%,#13132a 100%)",
          border:`1px solid ${hov&&badge.earned?r.strokeHex+"44":"rgba(255,255,255,0.06)"}`,
          borderRadius:18,padding:22,
          display:"flex",flexDirection:"column",gap:14,
          cursor:badge.earned?"pointer":"default",
          opacity:badge.earned?1:0.58,
          position:"relative",overflow:"visible",
          boxShadow: hov&&badge.earned
            ? `0 24px 60px rgba(0,0,0,0.5),0 0 0 1px ${r.strokeHex}33,0 0 60px ${r.glowHex}`
            : "var(--shadow-card)",
          transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hov&&badge.earned?"translateY(-6px)":""}`,
          transition:hov?"box-shadow .2s,border-color .2s":"all .45s cubic-bezier(0.34,1.56,0.64,1)",
          animation:"bcIn .5s ease both",
        }}
        onMouseEnter={()=>setHov(true)}
        onMouseMove={badge.earned?onMove:undefined}
        onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}}
        onMouseOut={()=>setTooltip(false)}
        onClick={onClick}>

        {/* Ripples */}
        {ripples.map(rp=>(
          <div key={rp.id} style={{position:"absolute",left:rp.x,top:rp.y,transform:"translate(-50%,-50%)",
            borderRadius:"50%",background:`${r.strokeHex}18`,
            animation:"bcRip .7s ease-out forwards",pointerEvents:"none",zIndex:0,overflow:"hidden"}}/>
        ))}

        {/* Legendary prismatic top bar */}
        {hov&&badge.rarity==="legendary"&&badge.earned&&(
          <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,borderRadius:"18px 18px 0 0",
            background:"linear-gradient(90deg,#6C63FF,#8B5CF6,#3B82F6,#F59E0B,#22c55e,#6C63FF)",
            backgroundSize:"300% auto",animation:"bcPris 2.5s linear infinite",pointerEvents:"none"}}/>
        )}

        {/* Glow blob on hover */}
        {hov&&badge.earned&&<div style={{position:"absolute",top:-40,right:-40,width:140,height:140,
          borderRadius:"50%",background:`${r.strokeHex}12`,filter:"blur(44px)",pointerEvents:"none",zIndex:0}}/>}

        {/* Locked tooltip */}
        {!badge.earned&&<LockedTooltip badge={badge} visible={tooltip||hov}/>}

        {/* Top: icon + pills */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1}}>
          <BadgeIcon badge={badge} size="md" earned={badge.earned} animated={badge.earned}/>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            {/* Rarity pill */}
            <span style={{
              background:`${r.strokeHex}18`,border:`1px solid ${r.strokeHex}44`,
              color:r.strokeHex,fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:999,
              textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace",
              boxShadow:`0 0 10px ${r.glowHex}`}}>
              {r.label}
            </span>
            {badge.earned
              ? <span style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.22)",color:"#22c55e",
                  fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:999,fontFamily:"'DM Sans',sans-serif",
                  display:"flex",alignItems:"center",gap:3}}>
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#22c55e"/></svg>
                  Earned
                </span>
              : <span style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                  color:"var(--text-muted)",fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:999,fontFamily:"'DM Sans',sans-serif"}}>
                  Locked
                </span>}
          </div>
        </div>

        {/* Name + desc */}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{color:"var(--text)",fontSize:15,fontWeight:800,fontFamily:"'DM Sans',sans-serif",marginBottom:5,letterSpacing:"-0.01em"}}>
            {badge.name}
          </div>
          <div style={{color:"var(--text-muted)",fontSize:12,lineHeight:1.55,fontFamily:"'DM Sans',sans-serif"}}>
            {badge.description}
          </div>
        </div>

        {/* Earned date OR unlock condition */}
        <div style={{position:"relative",zIndex:1}}>
          {badge.earned&&badge.earnedOn
            ? <div style={{display:"flex",alignItems:"center",gap:5,color:"var(--text-muted)",fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                Earned on {fmt(badge.earnedOn)}
              </div>
            : <div style={{color:"var(--text-faint)",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",
                display:"flex",alignItems:"center",gap:4}}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                {badge.unlockCondition}
              </div>}
        </div>

        {/* Partial progress bar for locked badges with progress */}
        {hasProgress&&(
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"var(--text-muted)",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Progress</span>
              <span style={{color:r.strokeHex,fontSize:10,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{badge.progress} / {badge.total}</span>
            </div>
            <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:999,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${r.strokeHex},${r.strokeHex}aa)`,
                borderRadius:999,boxShadow:`0 0 8px ${r.glowHex}`,transition:"width 1s ease"}}/>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",
          justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:5,animation:hov&&badge.earned?"bcXp .4s ease":"none"}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{color:"var(--accent-gold)",fontSize:12,fontWeight:800,fontFamily:"'DM Mono',monospace"}}>+{badge.xpReward} XP</span>
          </div>
          <span style={{color:"var(--text-faint)",fontSize:10,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".06em"}}>{badge.rarity}</span>
        </div>

        {/* Hover CTA for earned */}
        {hov&&badge.earned&&(
          <div style={{position:"absolute",bottom:14,left:"50%",
            background:"linear-gradient(135deg,var(--primary),#4f46e5)",
            color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",
            borderRadius:999,whiteSpace:"nowrap",zIndex:2,
            boxShadow:"0 4px 14px rgba(108,99,255,0.45)",
            animation:"bcHint .25s ease forwards"}}>
            View Details →
          </div>
        )}
      </div>
    </>
  );
}