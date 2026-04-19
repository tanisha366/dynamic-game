// src/utils/levels.js
// Level thresholds as per Apr 21 brief

export const LEVELS = [
  { level: 1, name: "Novice",      minXP: 0,    maxXP: 99,   color: "#9CA3AF", icon: "◎" },
  { level: 2, name: "Apprentice",  minXP: 100,  maxXP: 249,  color: "#3B82F6", icon: "◈" },
  { level: 3, name: "Scholar",     minXP: 250,  maxXP: 499,  color: "#8B5CF6", icon: "⟡" },
  { level: 4, name: "Expert",      minXP: 500,  maxXP: 999,  color: "#6366f1", icon: "✦" },
  { level: 5, name: "Master",      minXP: 1000, maxXP: 1999, color: "#d97706", icon: "⬡" },
  { level: 6, name: "Champion",    minXP: 2000, maxXP: 4999, color: "#dc2626", icon: "⊕" },
  { level: 7, name: "Legend",      minXP: 5000, maxXP: Infinity, color: "#F59E0B", icon: "★" },
];

/**
 * getLevelInfo(points) → { level, levelName, icon, color, currentXP, xpNeeded, percentage, nextLevelName }
 * As per Apr 21 brief spec
 */
export function getLevelInfo(points) {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minXP) { current = LEVELS[i]; break; }
  }
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;

  const rangeStart = current.minXP;
  const rangeEnd   = next ? next.minXP : current.minXP + 1;
  const earned     = points - rangeStart;
  const range      = rangeEnd - rangeStart;
  const percentage = next ? Math.min(100, Math.round((earned / range) * 100)) : 100;

  return {
    level:         current.level,
    levelName:     current.name,
    icon:          current.icon,
    color:         current.color,
    currentXP:     points,
    xpForThisLevel:rangeStart,
    xpNeeded:      next ? next.minXP : points,
    xpToNext:      next ? next.minXP - points : 0,
    percentage,
    nextLevelName: next ? next.name : null,
    isMaxLevel:    !next,
  };
}

export function getLevelMotivation(percentage) {
  if (percentage >= 90) return "Almost leveling up!";
  if (percentage >= 70) return "You're on fire — push through!";
  if (percentage >= 50) return "Halfway to the next rank!";
  if (percentage >= 25) return "Building momentum...";
  return "Every XP counts. Keep going!";
}