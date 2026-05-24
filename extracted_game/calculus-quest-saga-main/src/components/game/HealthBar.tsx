type Props = {
  label: string;
  value: number;
  max: number;
  variant: "hp" | "mp" | "xp";
};

const colorMap = {
  hp: "bg-hp",
  mp: "bg-mp",
  xp: "bg-xp",
};

export function HealthBar({ label, value, max, variant }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between font-display text-sm leading-none">
        <span className="text-muted-foreground tracking-widest">{label}</span>
        <span className="text-foreground text-glow">
          {Math.max(0, Math.ceil(value))}/{max}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-sm border-2 border-border bg-background/60">
        <div
          className={`h-full ${colorMap[variant]} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.25),transparent_40%,rgba(0,0,0,0.3))]" />
      </div>
    </div>
  );
}
