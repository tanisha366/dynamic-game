// src/components/rewards/Toast.jsx
import { useToast } from "../../context/ToastContext";

const TCFG = {
  success: { border:"#22c55e", accent:"#22c55e", label:"Success",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
  info: { border:"#6C63FF", accent:"#6C63FF", label:"Info",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  warning: { border:"#F59E0B", accent:"#F59E0B", label:"Warning",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  badge: { border:"#8B5CF6", accent:"#8B5CF6", label:"Badge Unlocked!",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z"/></svg> },
  points: { border:"#FFD700", accent:"#FFD700", label:"Points Earned",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> },
  streak: { border:"#ef4444", accent:"#ef4444", label:"Streak!",
    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><path d="M12 2c0 0-5 5-5 11 0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-2-5-2-5 0 0-1 3-3 3s-2-3-2-3S8 10 8 12"/><circle cx="12" cy="19" r="2" fill="#f87171"/></svg> },
};

function PointsCtr({ target }) {
  const [v, setV] = require("react").useState(0);
  require("react").useEffect(() => {
    const s = performance.now(), d = 700;
    const t = (now) => { const p = Math.min((now-s)/d,1), e=1-Math.pow(1-p,3); setV(Math.round(e*target)); if(p<1) requestAnimationFrame(t); };
    requestAnimationFrame(t);
  }, [target]);
  return <span style={{fontWeight:900,color:"#FFD700"}}>+{v}</span>;
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  return (
    <>
      <style>{`
        @keyframes tIn  { from{transform:translateX(115%) scale(0.82);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes tOut { from{transform:translateX(0) scale(1);opacity:1} to{transform:translateX(115%) scale(0.82);opacity:0} }
        @keyframes tBar { from{width:100%} to{width:0%} }
        .t-item      { animation:tIn  0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; transition:transform 0.2s ease; }
        .t-item.exit { animation:tOut 0.38s ease-in forwards; }
        .t-item:hover{ transform:translateX(-5px) scale(1.01); }
        .t-x:hover   { opacity:1!important; transform:rotate(90deg) scale(1.2); }
      `}</style>
      <div style={{position:"fixed",top:22,right:22,zIndex:9999,display:"flex",flexDirection:"column",gap:10,maxWidth:360,width:"100%",pointerEvents:"none"}}>
        {toasts.map(t => {
          const c = TCFG[t.type] || TCFG.info;
          return (
            <div key={t.id} className={`t-item${t.exiting?" exit":""}`}
              style={{background:"linear-gradient(135deg,rgba(26,26,46,0.98),rgba(22,22,40,0.98))",
                border:`1px solid ${c.border}44`,borderRadius:14,overflow:"hidden",
                boxShadow:`0 8px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.03),0 0 20px ${c.border}18`,
                backdropFilter:"blur(20px)",pointerEvents:"all",cursor:"pointer"}}
              onClick={() => dismissToast(t.id)}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:`linear-gradient(180deg,${c.border},${c.border}55)`}}/>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"13px 12px 9px 18px"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${c.border}18`,border:`1px solid ${c.border}33`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {c.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{color:"#7B7B9A",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2,fontFamily:"'DM Mono',monospace"}}>{c.label}</div>
                  <div style={{color:"#E8E8F0",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500,lineHeight:1.4}}>
                    {t.type==="points"&&t.points ? <><PointsCtr target={t.points}/> {t.message}</> :
                     t.type==="streak"&&t.streak  ? <>{t.message} <span style={{color:"#ef4444",fontWeight:800}}>{t.streak} days 🔥</span></> :
                     t.message}
                  </div>
                </div>
                <button className="t-x" onClick={e=>{e.stopPropagation();dismissToast(t.id);}}
                  style={{background:"none",border:"none",color:"#3D3D5C",cursor:"pointer",padding:3,opacity:0.6,transition:"all 0.2s",flexShrink:0}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{height:2,background:"rgba(255,255,255,0.04)",margin:"0 16px 9px"}}>
                <div style={{height:"100%",background:c.border,animation:"tBar 3.5s linear forwards",borderRadius:999,opacity:0.7}}/>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default ToastContainer;