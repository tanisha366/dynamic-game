// src/components/rewards/BadgeCard.jsx
import { useState, useRef } from "react";
import BadgeIcon from "./BadgeIcon";

const TIER = {
  bronze:{ text:"#b45309", bg:"rgba(180,83,9,0.08)",   border:"rgba(180,83,9,0.22)"   },
  silver:{ text:"#475569", bg:"rgba(71,85,105,0.07)",  border:"rgba(71,85,105,0.2)"   },
  gold:  { text:"#d97706", bg:"rgba(217,119,6,0.1)",   border:"rgba(217,119,6,0.28)"  },
};
const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : null;

export default function BadgeCard({ badge, onSelect }) {
  const [hov, setHov]       = useState(false);
  const [tilt, setTilt]     = useState({x:0,y:0});
  const [ripples, setRipples] = useState([]);
  const ref = useRef(null);
  const tc = TIER[badge.tier] || TIER.bronze;

  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY-r.top-r.height/2)/(r.height/2))*-6, y: ((e.clientX-r.left-r.width/2)/(r.width/2))*6 });
  };

  const onClick = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(p=>[...p,{id, x:e.clientX-r.left, y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(r=>r.id!==id)), 700);
    if (badge.unlocked && onSelect) onSelect(badge);
  };

  const cardBg = hov && badge.unlocked
    ? badge.tier==="gold"  ? "linear-gradient(145deg,rgba(255,252,235,0.97),rgba(255,255,255,0.93))"
    : badge.tier==="silver"? "linear-gradient(145deg,rgba(248,250,252,0.97),rgba(255,255,255,0.93))"
    :                        "linear-gradient(145deg,rgba(255,247,235,0.97),rgba(255,255,255,0.93))"
    : "rgba(255,255,255,0.78)";

  return (
    <>
      <style>{`
        @keyframes bcRipple   { 0%{width:0;height:0;opacity:0.35} 100%{width:400px;height:400px;opacity:0} }
        @keyframes bcIn       { from{opacity:0;transform:translateY(22px) scale(0.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bcHint     { from{opacity:0;transform:translateX(-50%) translateY(6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes bcXpPop    { 0%{transform:scale(1)} 50%{transform:scale(1.16)} 100%{transform:scale(1)} }
        @keyframes bcPrismatic{ 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes bcGlowPulse { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes bcBadgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bcUnlockGlow { 0%{transform:scale(0.8);opacity:0} 50%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes bcShimmerMove { 0%{left:-100%;opacity:0} 50%{opacity:1} 100%{left:100%;opacity:0} }
      `}</style>
      <div ref={ref}
        style={{
          background: cardBg,
          backdropFilter:"blur(20px)",
          border:`1px solid ${hov&&badge.unlocked?tc.border:"rgba(0,0,0,0.06)"}`,
          borderRadius:18, padding:20,
          display:"flex", flexDirection:"column", gap:14,
          cursor:badge.unlocked?"pointer":"default",
          opacity:badge.unlocked?1:0.62,
          position:"relative", overflow:"hidden",
          boxShadow: hov&&badge.unlocked
            ? `0 20px 50px rgba(0,0,0,0.1),0 0 0 1px ${tc.border},0 4px 60px ${tc.bg}`
            : "0 4px 16px rgba(0,0,0,0.06),0 1px 0 rgba(255,255,255,0.9) inset",
          transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hov&&badge.unlocked?"translateY(-6px)":""}`,
          transition:hov?"box-shadow 0.2s,border-color 0.2s":"all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          animation:"bcIn 0.5s ease both",
        }}
        onMouseEnter={()=>setHov(true)}
        onMouseMove={badge.unlocked?onMove:undefined}
        onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}}
        onClick={onClick}>

        {/* Ripples */}
        {ripples.map(r=>(
          <div key={r.id} style={{position:"absolute",left:r.x,top:r.y,transform:"translate(-50%,-50%)",borderRadius:"50%",
            background:`${tc.text}14`,animation:"bcRipple 0.7s ease-out forwards",pointerEvents:"none",zIndex:0}}/>
        ))}

        {/* Prismatic top bar (gold) */}
        {hov&&badge.tier==="gold"&&badge.unlocked&&(
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,
            background:"linear-gradient(90deg,#f59e0b,#a855f7,#6366f1,#06b6d4,#f59e0b)",
            backgroundSize:"300% auto",animation:"bcPrismatic 2s linear infinite",pointerEvents:"none"}}/>
        )}

        {/* Glow blob */}
        {hov&&badge.unlocked&&<div style={{position:"absolute",top:-40,right:-40,width:130,height:130,
          borderRadius:"50%",background:tc.bg,filter:"blur(40px)",pointerEvents:"none",zIndex:0,
          animation:"bcGlowPulse 2s ease-in-out infinite"}}/>}

        {/* Top row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1}}>
          <BadgeIcon tier={badge.tier} icon={badge.icon} unlocked={badge.unlocked} size={54}/>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
            <span style={{background:tc.bg,border:`1px solid ${tc.border}`,color:tc.text,
              fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:999,
              textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>
              {badge.tier}
            </span>
            {badge.unlocked
              ? <span style={{background:"rgba(22,163,74,0.07)",border:"1px solid rgba(22,163,74,0.18)",
                    color:"#16a34a",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:999,
                    fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:3}}>
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#16a34a"/></svg>
                  Unlocked
                </span>
              : <span style={{background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.07)",color:"#cbd5e1",
                    fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:999,fontFamily:"'DM Sans',sans-serif"}}>
                  Locked
                </span>}
          </div>
        </div>

        {/* Name + desc */}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{color:"#1e1b4b",fontSize:15,fontWeight:800,fontFamily:"'DM Sans',sans-serif",marginBottom:5,letterSpacing:"-0.01em"}}>
            {badge.name}
          </div>
          <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.55,fontFamily:"'DM Sans',sans-serif"}}>
            {badge.description}
          </div>
        </div>

        {/* Footer */}
        <div style={{paddingTop:12,borderTop:"1px solid rgba(0,0,0,0.05)",display:"flex",
          justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
          <div style={{animation:hov&&badge.unlocked?"bcXpPop 0.4s ease":"none",display:"flex",alignItems:"center",gap:5}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{color:"#b45309",fontSize:12,fontWeight:800,fontFamily:"'DM Mono',monospace"}}>+{badge.xpReward} XP</span>
          </div>
          {badge.unlocked&&badge.unlockedAt
            ?<span style={{color:"#cbd5e1",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>{fmt(badge.unlockedAt)}</span>
            :<span style={{color:"#e2e8f0",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{badge.xpRequired.toLocaleString()} req.</span>}
        </div>

        {/* Hover hint */}
        {hov&&badge.unlocked&&(
          <div style={{position:"absolute",bottom:12,left:"50%",
            background:"linear-gradient(135deg,#4f46e5,#6366f1)",
            color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",
            borderRadius:999,whiteSpace:"nowrap",zIndex:2,
            boxShadow:"0 4px 12px rgba(99,102,241,0.3)",
            animation:"bcHint 0.25s ease forwards"}}>
            View Details →
          </div>
        )}
      </div>
    </>
  );
}