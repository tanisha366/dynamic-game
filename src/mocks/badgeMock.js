// src/mocks/badgeMock.js
// 6 badges as per design plan — Apr 17 brief
// Rarity: Common=gray, Rare=blue, Epic=purple, Legendary=gold

export const MOCK_USER = {
  name: "Tanisha",
  totalPoints: 1350,
  streakDays: 6,
  quizzesCompleted: 14,
  subjectQuizCounts: { Math: 6, Science: 3, English: 2, History: 3 },
  nightOwlQuizzes: 1,
  perfectScores: 0,
};

export const badges = [
  {
    id: "badge_starter_star",
    name: "Starter Star",
    icon: "star",
    rarity: "common",          // Common = gray
    description: "Complete your very first quiz and ignite the journey.",
    unlockCondition: "Complete 1 quiz",
    unlockConditionDetail: "Complete any quiz to earn this badge.",
    earned: true,
    earnedOn: "2025-04-10T09:15:00Z",
    earnedProgress: 1,
    totalRequired: 1,
    xpReward: 50,
    category: "milestone",
  },
  {
    id: "badge_sharp_mind",
    name: "Sharp Mind",
    icon: "lightning",
    rarity: "legendary",       // Legendary = gold (hardest)
    description: "Achieve a perfect 100% score on any quiz. Perfection is a choice.",
    unlockCondition: "Score 100% on a quiz",
    unlockConditionDetail: "Answer every question correctly in a single quiz attempt.",
    earned: false,
    earnedOn: null,
    earnedProgress: 0,
    totalRequired: 1,
    xpReward: 300,
    category: "performance",
  },
  {
    id: "badge_on_fire",
    name: "On Fire",
    icon: "flame",
    rarity: "rare",            // Rare = blue
    description: "Maintain a learning streak for 3 consecutive days.",
    unlockCondition: "3-day streak",
    unlockConditionDetail: "Complete at least one quiz every day for 3 days in a row.",
    earned: true,
    earnedOn: "2025-04-13T14:20:00Z",
    earnedProgress: 3,
    totalRequired: 3,
    xpReward: 100,
    category: "streak",
  },
  {
    id: "badge_quiz_master",
    name: "Quiz Master",
    icon: "crown",
    rarity: "epic",            // Epic = purple
    description: "Complete 10 quizzes across any subject. Volume builds mastery.",
    unlockCondition: "Complete 10 quizzes",
    unlockConditionDetail: "Finish 10 quizzes total across any subjects.",
    earned: true,
    earnedOn: "2025-04-16T18:00:00Z",
    earnedProgress: 14,
    totalRequired: 10,
    xpReward: 200,
    category: "milestone",
  },
  {
    id: "badge_subject_expert",
    name: "Subject Expert",
    icon: "book",
    rarity: "epic",            // Epic = purple
    description: "Complete 5 quizzes in the same subject. Depth over breadth.",
    unlockCondition: "5 quizzes in one subject",
    unlockConditionDetail: "Complete 5 quizzes within a single subject category.",
    earned: false,
    earnedOn: null,
    earnedProgress: 6,         // Math: 6 — so almost done! (shows progress)
    totalRequired: 5,
    xpReward: 175,
    category: "exploration",
  },
  {
    id: "badge_night_owl",
    name: "Night Owl",
    icon: "moon",
    rarity: "rare",            // Rare = blue
    description: "Take a quiz after 10 PM. The night belongs to the dedicated.",
    unlockCondition: "Quiz after 10 PM",
    unlockConditionDetail: "Start and complete a quiz session after 10:00 PM.",
    earned: false,
    earnedOn: null,
    earnedProgress: 0,
    totalRequired: 1,
    xpReward: 80,
    category: "special",
  },
];

export const RARITY_CONFIG = {
  common: {
    label: "Common",
    stroke: "#9CA3AF",
    fill: "#F3F4F6",
    textColor: "#6B7280",
    glowColor: "rgba(156,163,175,0.4)",
    pillBg: "rgba(156,163,175,0.12)",
    pillBorder: "rgba(156,163,175,0.3)",
    gradient: "linear-gradient(135deg,#F3F4F6,#E5E7EB)",
  },
  rare: {
    label: "Rare",
    stroke: "#3B82F6",
    fill: "#EFF6FF",
    textColor: "#1D4ED8",
    glowColor: "rgba(59,130,246,0.45)",
    pillBg: "rgba(59,130,246,0.1)",
    pillBorder: "rgba(59,130,246,0.3)",
    gradient: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
  },
  epic: {
    label: "Epic",
    stroke: "#8B5CF6",
    fill: "#F5F3FF",
    textColor: "#6D28D9",
    glowColor: "rgba(139,92,246,0.45)",
    pillBg: "rgba(139,92,246,0.1)",
    pillBorder: "rgba(139,92,246,0.3)",
    gradient: "linear-gradient(135deg,#F5F3FF,#EDE9FE)",
  },
  legendary: {
    label: "Legendary",
    stroke: "#F59E0B",
    fill: "#FFFBEB",
    textColor: "#B45309",
    glowColor: "rgba(245,158,11,0.5)",
    pillBg: "rgba(245,158,11,0.12)",
    pillBorder: "rgba(245,158,11,0.35)",
    gradient: "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
  },
};

export default badges;