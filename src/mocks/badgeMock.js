// src/mocks/badgeMock.js
export const MOCK_USER = { name: "Tanisha", xp: 1350, streakDays: 6, level: 4 };
export const badges = [
  { id:"b001", name:"First Steps",      description:"Complete your very first quiz and begin the journey.",        icon:"star",   xpRequired:100,  xpReward:50,   tier:"bronze", unlocked:true,  unlockedAt:"2025-04-10T10:23:00Z", category:"milestone"   },
  { id:"b002", name:"Streak Starter",   description:"Maintain a 3-day learning streak. Consistency is mastery.",  icon:"flame",  xpRequired:300,  xpReward:75,   tier:"bronze", unlocked:true,  unlockedAt:"2025-04-13T14:10:00Z", category:"streak"      },
  { id:"b003", name:"Quiz Crusher",     description:"Score 90% or above on any quiz. Excellence recognized.",     icon:"zap",    xpRequired:500,  xpReward:100,  tier:"silver", unlocked:true,  unlockedAt:"2025-04-15T09:45:00Z", category:"performance" },
  { id:"b004", name:"Knowledge Seeker", description:"Complete quizzes in 3 different subjects.",                  icon:"book",   xpRequired:700,  xpReward:120,  tier:"silver", unlocked:true,  unlockedAt:"2025-04-16T16:30:00Z", category:"exploration" },
  { id:"b005", name:"Speed Demon",      description:"Finish a quiz under 2 minutes with 80%+ accuracy.",         icon:"timer",  xpRequired:900,  xpReward:150,  tier:"silver", unlocked:false, unlockedAt:null,                   category:"performance" },
  { id:"b006", name:"Week Warrior",     description:"Maintain a perfect 7-day streak.",                          icon:"shield", xpRequired:1200, xpReward:200,  tier:"gold",   unlocked:false, unlockedAt:null,                   category:"streak"      },
  { id:"b007", name:"Top Scholar",      description:"Reach the Top 10 on the global leaderboard.",               icon:"trophy", xpRequired:1500, xpReward:300,  tier:"gold",   unlocked:false, unlockedAt:null,                   category:"milestone"   },
  { id:"b008", name:"Perfect Score",    description:"Achieve 100% on any quiz. Perfection is not an accident.",  icon:"award",  xpRequired:1800, xpReward:250,  tier:"gold",   unlocked:false, unlockedAt:null,                   category:"performance" },
  { id:"b009", name:"Subject Master",   description:"Complete all quizzes in a single subject.",                  icon:"crown",  xpRequired:2200, xpReward:400,  tier:"gold",   unlocked:false, unlockedAt:null,                   category:"exploration" },
  { id:"b010", name:"Legend",           description:"Accumulate 5000 XP. You are the stuff of myths.",           icon:"gem",    xpRequired:5000, xpReward:1000, tier:"gold",   unlocked:false, unlockedAt:null,                   category:"milestone"   },
];
export default badges;