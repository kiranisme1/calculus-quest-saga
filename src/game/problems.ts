export type Problem = {
  prompt: string;
  choices: string[];
  answer: number; // index
  topic: string;
};

// A pool of calculus problems across difficulties (level 1-5+)
const POOL: Record<number, Problem[]> = {
  1: [
    { topic: "Derivative", prompt: "d/dx [ x² ]", choices: ["2x", "x", "x²/2", "2"], answer: 0 },
    { topic: "Derivative", prompt: "d/dx [ 5x ]", choices: ["0", "5", "5x", "x"], answer: 1 },
    { topic: "Limit", prompt: "lim x→0 (sin x)/x", choices: ["0", "∞", "1", "undefined"], answer: 2 },
    { topic: "Derivative", prompt: "d/dx [ x³ ]", choices: ["3x", "x²", "3x²", "x³/3"], answer: 2 },
    { topic: "Integral", prompt: "∫ 1 dx", choices: ["0", "x + C", "1 + C", "ln x"], answer: 1 },
  ],
  2: [
    { topic: "Derivative", prompt: "d/dx [ sin x ]", choices: ["-cos x", "cos x", "-sin x", "tan x"], answer: 1 },
    { topic: "Derivative", prompt: "d/dx [ eˣ ]", choices: ["eˣ", "x·eˣ⁻¹", "1", "ln x"], answer: 0 },
    { topic: "Integral", prompt: "∫ 2x dx", choices: ["x² + C", "2 + C", "x + C", "2x² + C"], answer: 0 },
    { topic: "Limit", prompt: "lim x→∞ 1/x", choices: ["1", "∞", "0", "-1"], answer: 2 },
    { topic: "Derivative", prompt: "d/dx [ ln x ]", choices: ["1/x", "ln(1)", "x", "eˣ"], answer: 0 },
  ],
  3: [
    { topic: "Chain Rule", prompt: "d/dx [ sin(2x) ]", choices: ["cos(2x)", "2cos(2x)", "-2cos(2x)", "2sin(2x)"], answer: 1 },
    { topic: "Product Rule", prompt: "d/dx [ x·eˣ ]", choices: ["eˣ", "x·eˣ", "(1+x)eˣ", "x·eˣ⁻¹"], answer: 2 },
    { topic: "Integral", prompt: "∫ cos x dx", choices: ["sin x + C", "-sin x + C", "-cos x + C", "tan x + C"], answer: 0 },
    { topic: "Limit", prompt: "lim x→0 (1-cos x)/x²", choices: ["0", "1", "1/2", "∞"], answer: 2 },
    { topic: "Derivative", prompt: "d/dx [ tan x ]", choices: ["sec x", "sec²x", "-csc²x", "1/cos x"], answer: 1 },
  ],
  4: [
    { topic: "Integral", prompt: "∫ eˣ dx", choices: ["eˣ + C", "x·eˣ + C", "ln x + C", "eˣ/x + C"], answer: 0 },
    { topic: "Chain Rule", prompt: "d/dx [ e^(x²) ]", choices: ["2x·e^(x²)", "e^(x²)", "x²·e^(x²)", "2·e^(x²)"], answer: 0 },
    { topic: "Definite", prompt: "∫₀¹ 3x² dx", choices: ["1", "3", "1/3", "0"], answer: 0 },
    { topic: "Quotient", prompt: "d/dx [ 1/x ]", choices: ["1/x²", "-1/x²", "ln x", "-1/x"], answer: 1 },
    { topic: "L'Hôpital", prompt: "lim x→0 (eˣ - 1)/x", choices: ["0", "1", "e", "∞"], answer: 1 },
  ],
  5: [
    { topic: "Integration", prompt: "∫ 1/x dx", choices: ["1 + C", "ln|x| + C", "-1/x² + C", "x + C"], answer: 1 },
    { topic: "Definite", prompt: "∫₀^π sin x dx", choices: ["0", "1", "2", "π"], answer: 2 },
    { topic: "By Parts", prompt: "∫ x·eˣ dx", choices: ["x·eˣ + C", "(x-1)eˣ + C", "eˣ/x + C", "x²eˣ/2 + C"], answer: 1 },
    { topic: "Series", prompt: "Σ 1/n² from 1→∞ =", choices: ["π/2", "π²/6", "e", "∞"], answer: 1 },
    { topic: "Chain", prompt: "d/dx [ ln(sin x) ]", choices: ["cot x", "tan x", "1/sin x", "-cot x"], answer: 0 },
  ],
};

export function pickProblem(level: number): Problem {
  const key = Math.min(5, Math.max(1, level));
  const list = POOL[key];
  return list[Math.floor(Math.random() * list.length)];
}
