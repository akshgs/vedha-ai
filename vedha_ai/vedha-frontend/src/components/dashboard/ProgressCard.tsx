type Props = {
  label: string;
  value: number;   // 0–100
  color?: "blue" | "green" | "orange" | "red";
  showPercent?: boolean;
  size?: "sm" | "md";
};

const COLORS = {
  blue:   "#3B82F6",
  green:  "#22C55E",
  orange: "#F59E0B",
  red:    "#EF4444",
};

export default function ProgressCard({
  label,
  value,
  color = "blue",
  showPercent = true,
  size = "md",
}: Props) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const barColor = COLORS[color];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8,
      }}>
        <span style={{
          fontSize: size === "sm" ? 14 : 16, // Body is 16px, Secondary is 14px
          fontWeight: 500, color: '#F1F5F9', flexGrow: 1
        }}>
          {label}
        </span>
        {showPercent && (
          <span style={{
            fontSize: size === "sm" ? 12 : 14,
            fontWeight: 600, color: barColor,
          }}>
            {clampedValue}%
          </span>
        )}
      </div>

      <div style={{
        width: '100%', height: size === "sm" ? 6 : 8,
        background: '#1F2937', borderRadius: 100, overflow: 'hidden',
      }}>
        <div style={{
          width: `${clampedValue}%`,
          height: '100%',
          background: barColor,
          borderRadius: 100,
          transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}