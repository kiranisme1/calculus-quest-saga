type Props = {
  label: string;
  value: number;
  max: number;
  variant: "hp" | "mp" | "xp";
};

export function HealthBar({ label, value, max, variant }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  let barColor = "green";
  if (variant === "hp") barColor = "red";
  if (variant === "mp") barColor = "blue";
  if (variant === "xp") barColor = "purple";

  return (
    <div style={{ marginTop: "8px", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <span>{label}</span>
        <span>{Math.max(0, Math.ceil(value))}/{max}</span>
      </div>
      <div style={{ width: "100%", height: "12px", background: "#333", borderRadius: "4px", overflow: "hidden", marginTop: "4px" }}>
        <div
          style={{
            height: "100%",
            width: pct + "%",
            background: barColor,
            transition: "width 0.5s ease-out"
          }}
        />
      </div>
    </div>
  );
}