// src/components/rewards/BadgeUnlockModal.jsx
import { useEffect, useState } from "react";
import BadgeIcon from "./BadgeIcon";
import { useToast } from "../../context/ToastContext";

export default function BadgeUnlockModal({ badge, onClose }) {
  const { showToast } = useToast();
  const [vis, setVis] = useState(false);
  const [particles, setParticles] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!badge) return;
    setTimeout(() => setVis(true), 20);
    const r = (a,b) => a + Math.random()*(b-a);
    setParticles(Array.from({length:30},(_,i)=>({
      id:i, angle:(i/30)*360+r(-8,8), dist:r(65,120), size:r(3,7),
      delay:r(0,0.3), color:["#6366f1","#d97706","#a855f7","#06b6d4","#f59e0b","#16a34a"][i%6],
    })));
    setConfetti(Array.from({length:26},(_,i)=>({
      id:i, x:r(5,95), delay:r(0,1.6), dur:r(2,4),
      size:r(5,11), color:["#6366f1","#d97706","#a855f7","#06b6d4","#f59e0b"][i%5],
      rot:r(-180,180), wob:r(-30,30),
    })));
  }, [badge]);

  const close = () => { setVis(false); setTimeout(onClose, 320); };
  const claim = () => { setClaimed(true); setTimeout(()=>{ showToast(`${badge.name} claimed! +${badge.xpReward} XP`, "badge"); close(); }, 380); };
  if (!badge) return null;

  const tierAccent = badge.tier==="gold"?"#d97706":badge.tier==="silver"?"#64748b":"#b45309";

  return (
    <>
      <style>{`
        @keyframes mOvIn   { from{opacity:0} to{opacity:1} }
        @keyframes mCardIn { 0%{transform:scale(0.55) translateY(60px);opacity:0} 60%{transform:scale(1.04) translateY(-8px)} 80%{transform:scale(0.97)} 100%{transform:scale(1);opacity:1} }
        @keyframes mCardOut{ from{transform:scale(1);opacity:1} to{transform:scale(0.8) translateY(28px);opacity:0} }
        @keyframes mBurst  { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--bx),var(--by)) scale(0);opacity:0} }
        @keyframes mFall   { 0%{transform:translateY(-20px) rotate(0deg)} 100%{transform:translateY(600px) rotate(var(--rot)) translateX(var(--wob))} }
        @keyframes mBadge  { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.18) rotate(8deg)} 80%{transform:scale(0.96) rotate(-3deg)} 100%{transform:scale(1);opacity:1} }
        @keyframes mRingPulse { 0%,100%{box-shadow:0 0 20px var(--ta)66} 50%{box-shadow:0 0 50px var(--ta)99,0 0 90px var(--ta)33} }
        @keyframes mShimTop{ 0%{opacity:0;transform:scaleX(0)} 60%{opacity:1} 100%{opacity:0;transform:scaleX(1)} }
        @keyframes mPrisma { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
        @keyframes mXpPop  { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes mBtnPulse{ 0%,100%{box-shadow:0 4px 20px rgba(99,102,241,0.25)} 50%{box-shadow:0 8px 36px rgba(99,102,241,0.45)} }
      `}</style>
      <div onClick={e=>e.target===e.currentTarget&&close()}
        style={{position:"fixed",inset:0,background:"rgba(15,14,23,0.6)",backdropFilter:"blur(12px)",
          zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,
          animation:"mOvIn 0.2s ease forwards"}}>
        {/* Confetti */}
        {confetti.map(c=>(
          <div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:0,width:c.size,height:c.size*0.45,
            background:c.color,borderRadius:2,opacity:0.8,
            "--rot":`${c.rot}deg`,"--wob":`${c.wob}px`,
            animation:`mFall ${c.dur}s ease-in ${c.delay}s both`,zIndex:10001,pointerEvents:"none"}}/>
        ))}
        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.94)",backdropFilter:"blur(40px)",
          border:`1px solid rgba(0,0,0,0.08)`,borderRadius:26,
          padding:"44px 36px",maxWidth:440,width:"100%",textAlign:"center",
          position:"relative",overflow:"hidden",
          boxShadow:"0 40px 100px rgba(0,0,0,0.2),0 0 0 1px rgba(255,255,255,0.8) inset",
          animation:vis?"mCardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards":"mCardOut 0.3s ease-in forwards",
          opacity:vis?1:0,
        }}>
          {/* Prismatic top */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,
            background:"linear-gradient(90deg,#6366f1,#a855f7,#06b6d4,#f59e0b,#16a34a,#6366f1)",
            backgroundSize:"300% auto",animation:"mPrisma 3s linear infinite"}}/>

          {/* Burst particles */}
          {particles.map(p=>(
            <div key={p.id} style={{position:"absolute",top:"42%",left:"50%",
              width:p.size,height:p.size,borderRadius:"50%",background:p.color,
              "--bx":`${Math.cos(p.angle*Math.PI/180)*p.dist}px`,
              "--by":`${Math.sin(p.angle*Math.PI/180)*p.dist}px`,
              animation:`mBurst 0.9s ease-out ${p.delay}s both`,pointerEvents:"none"}}/>
          ))}

          {/* Close */}
          <button onClick={close} style={{position:"absolute",top:16,right:16,
            background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.08)",
            borderRadius:8,color:"#94a3b8",cursor:"pointer",padding:7,display:"flex",
            transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,0.04)";}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Eyebrow */}
          <div style={{marginBottom:6,fontSize:10,fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",
            fontFamily:"'Orbitron',monospace",color:tierAccent,
            textShadow:`0 0 12px ${tierAccent}44`}}>
            ✦ Badge Unlocked ✦
          </div>

          {/* Badge */}
          <div style={{display:"flex",justifyContent:"center",margin:"22px 0","--ta":tierAccent,position:"relative",zIndex:1}}>
            <div style={{borderRadius:"50%",padding:14,animation:"mRingPulse 2s ease-in-out infinite",
              background:`radial-gradient(circle,${tierAccent}11 0%,transparent 70%)`}}>
              <div style={{animation:"mBadge 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.15s both"}}>
                <BadgeIcon tier={badge.tier} icon={badge.icon} unlocked size={86}/>
              </div>
            </div>
          </div>

          <h2 style={{color:"#1e1b4b",fontSize:24,fontWeight:900,fontFamily:"'Orbitron',sans-serif",
            letterSpacing:"-0.03em",marginBottom:8,position:"relative",zIndex:1}}>{badge.name}</h2>
          <p style={{color:"#64748b",fontSize:13,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",
            marginBottom:24,maxWidth:320,margin:"0 auto 24px",position:"relative",zIndex:1}}>{badge.description}</p>

          {/* XP pill */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:"linear-gradient(135deg,rgba(217,119,6,0.1),rgba(180,83,9,0.06))",
            border:"1px solid rgba(217,119,6,0.25)",borderRadius:999,padding:"9px 22px",marginBottom:26,
            animation:"mXpPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both",position:"relative",zIndex:1}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span style={{color:"#b45309",fontSize:17,fontWeight:900,fontFamily:"'Orbitron',monospace",letterSpacing:"-0.02em"}}>
              +{badge.xpReward} XP
            </span>
          </div>

          {/* Claim btn */}
          <button onClick={claim} disabled={claimed}
            style={{width:"100%",padding:"15px",position:"relative",zIndex:1,
              background:claimed?"linear-gradient(135deg,#dcfce7,#bbf7d0)":"linear-gradient(135deg,#6366f1,#4f46e5)",
              border:claimed?"1px solid rgba(22,163,74,0.3)":"none",
              borderRadius:14,color:claimed?"#16a34a":"#fff",
              fontSize:15,fontWeight:800,fontFamily:"'DM Sans',sans-serif",
              cursor:claimed?"default":"pointer",letterSpacing:"0.02em",
              boxShadow:claimed?"none":"0 4px 20px rgba(99,102,241,0.35),inset 0 1px 0 rgba(255,255,255,0.2)",
              animation:claimed?"none":"mBtnPulse 2.5s ease-in-out 1s infinite",transition:"all 0.3s ease"}}
            onMouseEnter={e=>{if(!claimed){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(99,102,241,0.5)";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            {claimed ? "✓ Claimed!" : "Claim Badge"}
          </button>
        </div>
      </div>
    </>
  );
}