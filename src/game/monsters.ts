export type Monster = {
  name: string;
  glyph: string;
  hp: number;
  atk: number;
  xp: number;
  level: number;
  taunt: string;
};

export const MONSTERS: Monster[] = [
  { name: "Limit Slime", glyph: "🟢", hp: 18, atk: 4, xp: 12, level: 1, taunt: "I approach... but never arrive." },
  { name: "Derivative Bat", glyph: "🦇", hp: 22, atk: 6, xp: 18, level: 2, taunt: "Slope is my prey!" },
  { name: "Tangent Wraith", glyph: "👻", hp: 30, atk: 8, xp: 28, level: 3, taunt: "I shall touch your soul... at one point." },
  { name: "Integral Golem", glyph: "🗿", hp: 44, atk: 10, xp: 42, level: 4, taunt: "I am the area beneath you." },
  { name: "Chain-Rule Hydra", glyph: "🐉", hp: 60, atk: 13, xp: 60, level: 5, taunt: "f(g(h(you)))" },
];

export const BOSS: Monster = {
  name: "ARCHON OF INFINITY",
  glyph: "👁️",
  hp: 120,
  atk: 18,
  xp: 200,
  level: 5,
  taunt: "All series converge to my will.",
};

export function monsterForFloor(floor: number): Monster {
  if (floor >= 10) return BOSS;
  return { ...MONSTERS[Math.min(MONSTERS.length - 1, Math.floor((floor - 1) / 2))] };
}
