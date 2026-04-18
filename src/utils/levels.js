// src/utils/levels.js
export const LEVELS = [
  { level:1,  title:"Novice",      minXP:0,     maxXP:299      },
  { level:2,  title:"Apprentice",  minXP:300,   maxXP:699      },
  { level:3,  title:"Explorer",    minXP:700,   maxXP:1199     },
  { level:4,  title:"Challenger",  minXP:1200,  maxXP:1999     },
  { level:5,  title:"Champion",    minXP:2000,  maxXP:2999     },
  { level:6,  title:"Elite",       minXP:3000,  maxXP:4199     },
  { level:7,  title:"Master",      minXP:4200,  maxXP:5499     },
  { level:8,  title:"Grandmaster", minXP:5500,  maxXP:6999     },
  { level:9,  title:"Legend",      minXP:7000,  maxXP:9999     },
  { level:10, title:"Mythic",      minXP:10000, maxXP:Infinity },
];
export const getLevelFromXP   = (xp) => { for(let i=LEVELS.length-1;i>=0;i--) if(xp>=LEVELS[i].minXP) return LEVELS[i]; return LEVELS[0]; };
export const getNextLevel     = (xp) => { const c=getLevelFromXP(xp); const ni=LEVELS.findIndex(l=>l.level===c.level)+1; return ni<LEVELS.length?LEVELS[ni]:null; };
export const getProgressPercent=(xp) => { const c=getLevelFromXP(xp);const n=getNextLevel(xp);if(!n)return 100;return Math.min(100,Math.round(((xp-c.minXP)/(n.minXP-c.minXP))*100)); };
export const getLevelMotivation=(xp) => { const p=getProgressPercent(xp);if(p>=90)return"Almost there!";if(p>=70)return"You're on fire!";if(p>=50)return"Halfway there!";if(p>=25)return"Building momentum...";return"Every XP counts!"; };