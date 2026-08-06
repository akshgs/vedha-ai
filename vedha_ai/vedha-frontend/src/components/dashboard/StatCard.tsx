import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;          // Tailwind bg class for icon container: e.g. "bg-blue-500/10"
  iconColor?: string;     // Tailwind text class for icon: e.g. "text-blue-500"
  textColor?: string;     // Alias for iconColor
  delta?: string;         // optional delta e.g. "+12%"
  deltaPositive?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  iconColor = "text-slate-400",
  textColor,
  delta,
  deltaPositive = true,
}: Props) {
  const activeIconColor = textColor || iconColor;
  return (
    <div
      className="ve-card ve-card-interactive"
      style={{ padding: 20, background: "#111827", borderColor: "#1F2937" }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: '#94A3B8', marginBottom: 8,
          }}>
            {title}
          </p>
          <p style={{
            fontSize: 36, fontWeight: 700, color: '#FFFFFF', // Page title is 36px, let's use 28px or 32px for stats to keep rhythm
            letterSpacing: '-0.025em', lineHeight: 1.2,
          }}>
            {value}
          </p>
          {delta && (
            <p style={{
              fontSize: 14, fontWeight: 500, marginTop: 6,
              color: deltaPositive ? '#22C55E' : '#EF4444',
            }}>
              {deltaPositive ? '↑' : '↓'} {delta}
            </p>
          )}
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className={`${color} ${activeIconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}