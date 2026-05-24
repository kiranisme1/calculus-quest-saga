import { createFileRoute } from "@tanstack/react-router";
import { BattleScreen } from "@/components/game/BattleScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Calculus Crypt — A Calculus RPG" },
      { name: "description", content: "Battle math monsters by solving calculus problems. Level up Newton the Apprentice and defeat the Archon of Infinity." },
      { property: "og:title", content: "Calculus Crypt — A Calculus RPG" },
      { property: "og:description", content: "Solve derivatives, integrals, and limits to slay monsters in a pixel-art dungeon." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=VT323&family=JetBrains+Mono:wght@400;700&display=swap" },
    ],
  }),
});

function Index() {
  return (
    <main>
      <BattleScreen />
    </main>
  );
}
