import { Sparkles } from "lucide-react";

type Props = {
  resumeScore: number;
  roadmapProgress: number;
  completedInterviews: number;
  totalJobs: number;
};

type InsightItem = {
  title: string;
  description: string;
  type: "info" | "success" | "warning";
};

const TYPE_STYLES = {
  info: {
    border: '#1F2937',
    bg: '#111827',
    icon: '#3B82F6',
    badge: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', text: 'AI Insight' },
  },
  success: {
    border: '#1F2937',
    bg: '#111827',
    icon: '#22C55E',
    badge: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', text: 'Progress' },
  },
  warning: {
    border: '#1F2937',
    bg: '#111827',
    icon: '#F59E0B',
    badge: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', text: 'Attention' },
  },
};

export default function AIInsights({
  resumeScore,
  roadmapProgress,
  completedInterviews,
  totalJobs,
}: Props) {
  const insights: InsightItem[] = [];

  if (resumeScore < 70) {
    insights.push({
      title: "Optimize ATS Resume",
      description: "Improve your resume to increase ATS compatibility and ecosystem matching opportunities.",
      type: "warning",
    });
  }

  if (roadmapProgress < 50) {
    insights.push({
      title: "Strengthen Core Competencies",
      description: "Continue progressing on your roadmap to unlock high-demand developer skills.",
      type: "info",
    });
  }

  if (completedInterviews < 3) {
    insights.push({
      title: "Improve Interview Confidence",
      description: "Practice more AI mock interviews to build fluency and get real-time feedback.",
      type: "info",
    });
  }

  if (totalJobs > 0) {
    insights.push({
      title: "Ecosystem Fit Opportunities",
      description: `You have ${totalJobs} matching jobs available. Apply now to get prioritized by recruiters.`,
      type: "success",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Excellent Progress",
      description: "You are meeting all dashboard readiness targets. Keep maintaining your performance!",
      type: "success",
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {insights.map((insight, i) => {
        const style = TYPE_STYLES[insight.type];
        return (
          <div
            key={i}
            style={{
              padding: '16px 20px',
              borderRadius: 8,
              border: `1px solid ${style.border}`,
              background: style.bg,
              borderLeft: `3px solid ${style.icon}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Sparkles size={12} style={{ color: style.icon, flexShrink: 0 }} />
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: style.badge.color,
                background: style.badge.bg, padding: '2px 8px', borderRadius: 4,
              }}>
                {style.badge.text}
              </span>
            </div>
            <p style={{ fontSize: 16, fontStyle: 'normal', fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
              {insight.title}
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.5 }}>
              {insight.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}