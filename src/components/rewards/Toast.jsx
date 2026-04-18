// src/components/rewards/Toast.jsx
import { useToast } from "../../context/ToastContext";

const CFG = {
  success:{ bg:"rgba(240,255,245,0.92)", border:"rgba(34,197,94,0.3)",  accent:"#16a34a", icon:"✓" },
  error:  { bg:"rgba(255,240,240,0.92)", border:"rgba(239,68,68,0.3)",   accent:"#dc2626", icon:"✕" },
  info:   { bg:"rgba(240,240,255,0.92)", border:"rgba(99,102,241,0.3)",  accent:"#4f46e5", icon:"i" },
  badge:  { bg:"rgba(255,252,230,0.95)", border:"rgba(234,179,8,0.4)",   accent:"#b45309", icon:"★" },
};

export default function Toast() {
  const { toasts, dismissToast } = useToast();
  return (
    <>
      <style>{`
        @keyframes tIn  { from{transform:translateX(110%) scale(0.85);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes tOut { from{transform:translateX(0) scale(1);opacity:1} to{transform:translateX(110%) scale(0.85);opacity:0} }
        @keyframes tProg{ from{width:100%} to{width:0%} }
        .t-item      { animation:tIn  0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .t-item.exit { animation:tOut 0.35s ease-in forwards; }
        .t-item:hover{ transform:translateX(-4px) !important; }
        .t-close:hover{ opacity:1 !important; transform:rotate(90deg); }
      `}</style>
      <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:10,maxWidth:360,width:"100%",pointerEvents:"none"}}>
        {toasts.map(t=>{
          const c=CFG[t.type]||CFG.info;
          return (
            <div key={t.id} className={`t-item${t.exiting?" exit":""}`}
              style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,overflow:"hidden",
                boxShadow:`0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.08)`,
                backdropFilter:"blur(20px)",pointerEvents:"all",cursor:"pointer",
                transition:"transform 0.2s ease"}}
              onClick={()=>dismissToast(t.id)}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px 9px 14px"}}>
                <div style={{width:28,height:28,borderRadius:8,background:c.accent,color:"#fff",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>
                  {c.icon}
                </div>
                <span style={{color:"#1a1a2e",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500,flex:1,lineHeight:1.4}}>{t.message}</span>
                <button className="t-close" onClick={e=>{e.stopPropagation();dismissToast(t.id);}}
                  style={{background:"none",border:"none",color:"#999",cursor:"pointer",opacity:0.5,transition:"all 0.2s",padding:2}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{height:2,background:"rgba(0,0,0,0.06)",margin:"0 14px 9px"}}>
                <div style={{height:"100%",background:c.accent,animation:"tProg 3.5s linear forwards",borderRadius:999,opacity:0.6}}/>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}