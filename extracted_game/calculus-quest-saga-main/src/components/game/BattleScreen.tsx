import { useEffect, useMemo, useRef, useState } from "react";
import { HealthBar } from "./HealthBar";
import { pickProblem, type Problem } from "@/game/problems";
import { monsterForFloor, type Monster } from "@/game/monsters";

type Hero = {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  xp: number;
  level: number;
  atk: number;
};

const INITIAL_HERO: Hero = {
  name: "Newton, the Apprentice",
  hp: 40, maxHp: 40,
  mp: 10, maxMp: 10,
  xp: 0,
  level: 1,
  atk: 8,
};

const xpToNext = (lvl: number) => 25 + (lvl - 1) * 20;

type LogEntry = { text: string; tone: "info" | "hit" | "crit" | "miss" | "magic" | "level" };

export function BattleScreen() {
  const [hero, setHero] = useState<Hero>(INITIAL_HERO);
  const [floor, setFloor] = useState(1);
  const [monster, setMonster] = useState<Monster>(() => monsterForFloor(1));
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [problem, setProblem] = useState<Problem>(() => pickProblem(1));
  const [spellMode, setSpellMode] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([
    { text: "You descend into the Calculus Crypt...", tone: "info" },
    { text: `A wild ${monster.name} appears! "${monster.taunt}"`, tone: "info" },
  ]);
  const [phase, setPhase] = useState<"choose" | "resolving" | "victory" | "gameover" | "win">("choose");
  const [shakeMonster, setShakeMonster] = useState(false);
  const [shakeHero, setShakeHero] = useState(false);
  const [flash, setFlash] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [log]);

  const xpNeeded = useMemo(() => xpToNext(hero.level), [hero.level]);

  function pushLog(entry: LogEntry) {
    setLog((l) => [...l, entry].slice(-40));
  }

  function nextEncounter(nextFloor: number, currentHero: Hero) {
    const m = monsterForFloor(nextFloor);
    setMonster(m);
    setMonsterHp(m.hp);
    setFloor(nextFloor);
    setProblem(pickProblem(m.level));
    setPhase("choose");
    setSpellMode(false);
    pushLog({ text: `— Floor ${nextFloor} —`, tone: "info" });
    pushLog({ text: `A ${m.name} blocks the path. "${m.taunt}"`, tone: "info" });
    if (nextFloor >= 10) pushLog({ text: "The air thickens with infinitesimals...", tone: "magic" });
    setHero(currentHero);
  }

  function answer(index: number) {
    if (phase !== "choose") return;
    const useSpell = spellMode && hero.mp >= 4;
    const correct = index === problem.answer;
    setPhase("resolving");
    setSpellMode(false);

    let h = { ...hero };
    let mHp = monsterHp;

    if (correct) {
      const base = useSpell ? hero.atk * 2 + 6 : hero.atk;
      const crit = Math.random() < 0.18;
      const dmg = Math.round(base * (crit ? 1.8 : 1));
      mHp -= dmg;
      if (useSpell) h.mp = Math.max(0, h.mp - 4);
      setShakeMonster(true); setFlash(true);
      setTimeout(() => { setShakeMonster(false); setFlash(false); }, 450);
      pushLog({
        text: crit
          ? `CRITICAL! ${useSpell ? "Arcane Bolt" : "Strike"} hits for ${dmg}!`
          : `${useSpell ? "Arcane Bolt" : "Strike"} lands for ${dmg}.`,
        tone: crit ? "crit" : useSpell ? "magic" : "hit",
      });
    } else {
      pushLog({ text: `Wrong! Answer was: ${problem.choices[problem.answer]}.`, tone: "miss" });
    }

    if (mHp > 0) {
      const dmg = Math.max(1, monster.atk - (correct ? 2 : 0) + Math.floor(Math.random() * 3));
      h.hp = Math.max(0, h.hp - dmg);
      setShakeHero(true);
      setTimeout(() => setShakeHero(false), 450);
      pushLog({ text: `${monster.name} hits you for ${dmg}.`, tone: "hit" });
    }

    setMonsterHp(mHp);

    setTimeout(() => {
      if (h.hp <= 0) {
        setHero(h);
        setPhase("gameover");
        pushLog({ text: "You collapse. The Crypt claims another mathematician.", tone: "miss" });
        return;
      }
      if (mHp <= 0) {
        const isBoss = floor >= 10;
        let gainedXp = h.xp + monster.xp;
        let level = h.level;
        let maxHp = h.maxHp;
        let maxMp = h.maxMp;
        let atk = h.atk;
        let needed = xpToNext(level);
        let leveled = false;
        while (gainedXp >= needed) {
          gainedXp -= needed;
          level += 1; maxHp += 10; maxMp += 3; atk += 2; leveled = true;
          needed = xpToNext(level);
        }
        const newHero: Hero = {
          ...h, xp: gainedXp, level, maxHp, maxMp, atk,
          hp: Math.min(maxHp, h.hp + (leveled ? maxHp : 4)),
          mp: Math.min(maxMp, h.mp + (leveled ? maxMp : 2)),
        };
        pushLog({ text: `Victory! +${monster.xp} XP.`, tone: "level" });
        if (leveled) pushLog({ text: `LEVEL UP! You are now Lv.${level}.`, tone: "level" });

        if (isBoss) {
          setHero(newHero); setPhase("win");
          pushLog({ text: "The Archon dissolves into a final integral...", tone: "magic" });
          return;
        }
        setPhase("victory");
        setHero(newHero);
        setTimeout(() => nextEncounter(floor + 1, newHero), 1100);
        return;
      }
      setHero(h);
      setProblem(pickProblem(monster.level));
      setPhase("choose");
    }, 650);
  }

  function reset() {
    const first = monsterForFloor(1);
    setHero(INITIAL_HERO);
    setFloor(1);
    setMonster(first);
    setMonsterHp(first.hp);
    setProblem(pickProblem(1));
    setSpellMode(false);
    setPhase("choose");
    setLog([
      { text: "A new apprentice enters the Crypt...", tone: "info" },
      { text: `A wild ${first.name} appears! "${first.taunt}"`, tone: "info" },
    ]);
  }

  const toneClass: Record<LogEntry["tone"], string> = {
    info: "text-muted-foreground",
    hit: "text-hp",
    crit: "text-primary text-glow",
    miss: "text-destructive",
    magic: "text-accent text-glow",
    level: "text-xp text-glow",
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 md:py-10">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-5xl tracking-widest text-primary text-glow">
          ∮ CALCULUS CRYPT
        </h1>
        <div className="font-display text-sm md:text-base text-muted-foreground">
          FLOOR <span className="text-primary text-glow">{String(floor).padStart(2, "0")}</span> / 10
        </div>
      </header>

      <section className="panel crt relative overflow-hidden rounded-md p-6 md:p-10">
        <div className="grid grid-cols-2 items-end gap-4">
          <div className={`flex flex-col items-center gap-2 ${shakeHero ? "shake" : ""}`}>
            <div className="font-display text-6xl md:text-8xl float">🧙</div>
            <div className="font-display text-sm md:text-base">{hero.name}</div>
            <div className="font-display text-xs text-muted-foreground">Lv. {hero.level}</div>
          </div>
          <div className={`flex flex-col items-center gap-2 ${shakeMonster ? "shake" : ""} ${flash ? "flash" : ""}`}>
            <div className="font-display text-6xl md:text-8xl float" style={{ animationDelay: "0.6s" }}>
              {monster.glyph}
            </div>
            <div className="font-display text-sm md:text-base">{monster.name}</div>
            <div className="w-40 max-w-full">
              <HealthBar label="HP" value={monsterHp} max={monster.hp} variant="hp" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-accent/20 to-transparent" />
      </section>

      <section className="panel grid grid-cols-1 gap-4 rounded-md p-4 md:grid-cols-3 md:p-6">
        <HealthBar label="HP" value={hero.hp} max={hero.maxHp} variant="hp" />
        <HealthBar label="MP" value={hero.mp} max={hero.maxMp} variant="mp" />
        <HealthBar label={`XP → Lv.${hero.level + 1}`} value={hero.xp} max={xpNeeded} variant="xp" />
      </section>

      <section className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="panel rounded-md p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-sm uppercase tracking-widest text-accent text-glow">
              ⟁ {problem.topic} {spellMode ? "— SPELL ARMED" : ""}
            </span>
            <span className="font-display text-xs text-muted-foreground">
              Solve to strike
            </span>
          </div>
          <div className="mb-5 rounded-sm border-2 border-border bg-background/60 p-4 font-display text-2xl md:text-4xl text-primary text-glow">
            {problem.prompt}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {problem.choices.map((c, i) => (
              <button
                key={i}
                disabled={phase !== "choose"}
                onClick={() => answer(i)}
                className="rounded-sm border-2 border-border bg-secondary px-4 py-3 text-left font-display text-lg text-secondary-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:text-glow disabled:opacity-50"
              >
                <span className="mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              disabled={phase !== "choose" || hero.mp < 4}
              onClick={() => setSpellMode((s) => !s)}
              className={`rounded-sm border-2 px-3 py-2 font-display text-sm transition disabled:opacity-40 ${
                spellMode
                  ? "border-accent bg-accent text-accent-foreground text-glow"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              ✦ Arcane Bolt (4 MP) — 2× damage
            </button>
            <span className="font-display text-xs text-muted-foreground">
              Toggle, then pick your answer.
            </span>
          </div>
        </div>

        <div className="panel flex max-h-[320px] flex-col rounded-md p-4 md:p-6">
          <div className="mb-2 font-display text-sm uppercase tracking-widest text-muted-foreground">
            Battle Log
          </div>
          <div ref={logRef} className="flex-1 space-y-1 overflow-y-auto pr-2 font-display text-base leading-snug">
            {log.map((l, i) => (
              <div key={i} className={toneClass[l.tone]}>› {l.text}</div>
            ))}
          </div>
        </div>
      </section>

      {(phase === "gameover" || phase === "win") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="panel mx-4 max-w-md rounded-md p-8 text-center">
            <h2 className={`font-display text-5xl ${phase === "win" ? "text-primary" : "text-destructive"} text-glow`}>
              {phase === "win" ? "INFINITY MASTERED" : "GAME OVER"}
            </h2>
            <p className="mt-3 font-display text-lg text-muted-foreground">
              {phase === "win"
                ? `You vanquished the Archon at Lv.${hero.level}!`
                : `You fell on floor ${floor}.`}
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-sm border-2 border-primary bg-primary px-6 py-3 font-display text-xl text-primary-foreground transition hover:-translate-y-0.5"
            >
              ↻ Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
