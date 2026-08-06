import type { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
};

export default function SectionCard({
  title,
  subtitle,
  action,
  icon,
  children,
  className = "",
  padding = true,
}: Props) {
  const hasHeader = title || subtitle || action;

  return (
    <div className={`ve-card ${className}`} style={{ padding: 0, background: "#111827", borderColor: "#1F2937" }}>
      {hasHeader && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, padding: '16px 24px',
          borderBottom: '1px solid #1F2937',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {icon && (
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: '#1F2937', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#94A3B8', flexShrink: 0,
              }}>
                {icon}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              {title && (
                <h3 style={{
                  fontSize: 20, fontWeight: 600, color: '#FFFFFF', // Card Title is 20px
                  lineHeight: 1.3, margin: 0,
                }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={{
                  fontSize: 14, color: '#94A3B8', marginTop: 2, // Secondary text is 14px
                  lineHeight: 1.4, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action && (
            <div style={{ flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: padding ? '24px' : '0' }}>
        {children}
      </div>
    </div>
  );
}