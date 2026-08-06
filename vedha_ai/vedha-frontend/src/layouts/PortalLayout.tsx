import { useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  Menu, X, Bell, Search, LogOut, ChevronLeft, ChevronRight,
  User as UserIcon, Zap, LayoutDashboard, BookOpen, Users,
  MessageSquare, FileText, Star, Code, Trophy, GraduationCap,
  Sparkles, Compass, Briefcase, ClipboardList, Calendar, BarChart,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { PORTAL_CONFIGS } from "@/config/navigation";
import CommandPalette from "@/components/ui/command-palette/CommandPalette";
import FloatingChatButton from "@/components/chatbot/FloatingChatButton";

interface PortalLayoutProps {
  children: React.ReactNode;
  role: string;
}

const ROLE_ACCENT: Record<string, string> = {
  student:   '#3B82F6',
  company:   '#8B5CF6',
  recruiter: '#06B6D4',
  employee:  '#22C55E',
  admin:     '#F59E0B',
  mentor:    '#10B981',
};

interface NavGroup {
  label: string;
  items: { title: string; path: string; icon: any }[];
}

const STUDENT_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Career",
    items: [
      { title: "Career Intelligence", path: "/student/career", icon: Sparkles },
      { title: "Roadmaps", path: "/student/roadmap", icon: GraduationCap },
      { title: "Skills & Assessment", path: "/student/skills", icon: Star },
      { title: "Student Analytics", path: "/student/analytics", icon: BarChart },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "Learning Academy", path: "/student/learning", icon: BookOpen },
      { title: "LeetCode Sandbox", path: "/coding/problems", icon: Code },
      { title: "Contest Arena", path: "/coding/contests", icon: Trophy },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "AI Research", path: "/student/ai/research", icon: Compass },
      { title: "AI PDF Chat", path: "/student/ai/pdf-chat", icon: FileText },
      { title: "Interview AI", path: "/student/interview", icon: MessageSquare },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Collaboration Feed", path: "/collaboration/feed", icon: Compass },
      { title: "Mentorship Networks", path: "/collaboration/mentors", icon: Users },
      { title: "Direct Messages", path: "/collaboration/messages", icon: MessageSquare },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { title: "Job Marketplace", path: "/recruitment/jobs", icon: Briefcase },
      { title: "Applications", path: "/recruitment/applications", icon: ClipboardList },
      { title: "Interview Scheduler", path: "/recruitment/interviews", icon: Calendar },
      { title: "Resume AI", path: "/student/resume", icon: FileText },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile Settings", path: "/student/profile", icon: UserIcon },
      { title: "Settings", path: "/student/settings", icon: Settings },
    ],
  },
];

function getGroupsForRole(role: string, config: any): NavGroup[] {
  if (role === 'student') return STUDENT_GROUPS;
  return [{ label: "", items: config.menuItems }];
}

export default function PortalLayout({ children, role }: PortalLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() =>
    localStorage.getItem("sidebar_collapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Interview scheduled", desc: "Mock Interview with AI is ready.", time: "10m ago", read: false },
    { id: 2, title: "Resume analyzed", desc: "Your ATS score increased to 87%.", time: "1h ago", read: false },
    { id: 3, title: "New course recommended", desc: "AI recommended 'Advanced System Design'", time: "4h ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const config = PORTAL_CONFIGS[role] || PORTAL_CONFIGS.student;
  const accent = ROLE_ACCENT[role] || '#3B82F6';
  const groups = getGroupsForRole(role, config);

  const pathnames = location.pathname.split("/").filter(Boolean);

  function toggleCollapse() {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  }

  function handleLogout() {
    logout();
    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  }

  function markAllRead() {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    toast.success("All notifications marked as read");
  }

  const sidebarW = isCollapsed ? 64 : 240;
  const showExpanded = !isCollapsed || mobileOpen;

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      overflow: 'hidden', background: '#0B1220',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <CommandPalette />

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(3, 7, 18, 0.6)',
            }}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: mobileOpen ? 240 : sidebarW }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="sidebar"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          background: '#0F172A',
          borderRight: '1px solid #1F2937',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{
          height: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 14px',
          borderBottom: '1px solid #1F2937',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', minWidth: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6, flexShrink: 0,
              background: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: 'white', letterSpacing: '-0.02em',
            }}>V</div>

            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0 }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    Vedha AI
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: accent, marginTop: 1,
                    opacity: 0.9,
                  }}>
                    {config.portalName}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="mobile-close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', padding: 4, display: 'none',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '10px 8px',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {groups.map((group, gi) => (
            <div key={gi} style={{ marginTop: gi > 0 ? 8 : 0 }}>
              {/* Group label */}
              {group.label && showExpanded && (
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#64748B',
                  padding: '6px 8px 4px',
                }}>
                  {group.label}
                </div>
              )}
              {/* Group divider when collapsed */}
              {group.label && !showExpanded && gi > 0 && (
                <div style={{ borderTop: '1px solid #1F2937', margin: '6px 0' }} />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  location.pathname.startsWith(item.path + '/');

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={!showExpanded ? item.title : undefined}
                    style={({ isActive: navActive }) => ({
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: showExpanded ? '7px 10px' : '9px 0',
                      justifyContent: showExpanded ? 'flex-start' : 'center',
                      borderRadius: 6,
                      textDecoration: 'none',
                      fontSize: 13, fontWeight: isActive || navActive ? 600 : 400,
                      transition: 'all 0.12s ease',
                      background: isActive || navActive ? `${accent}15` : 'transparent',
                      color: isActive || navActive ? '#FFFFFF' : '#94A3B8',
                      position: 'relative',
                    })}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      const active = location.pathname.startsWith(item.path);
                      if (!active) {
                        el.style.background = 'rgba(255,255,255,0.04)';
                        el.style.color = '#F1F5F9';
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      const active = location.pathname.startsWith(item.path);
                      if (!active) {
                        el.style.background = 'transparent';
                        el.style.color = '#94A3B8';
                      }
                    }}
                  >
                    {isActive && (
                      <span style={{
                        position: 'absolute', left: 0, top: '22%', bottom: '22%',
                        width: 3, borderRadius: 2, background: accent,
                      }} />
                    )}
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <AnimatePresence>
                      {showExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          style={{ overflow: 'hidden', whiteSpace: 'nowrap', lineHeight: '1.4' }}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{
          padding: '10px 8px',
          borderTop: '1px solid #1F2937',
        }}>
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '7px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 6, cursor: 'pointer',
              color: '#64748B', transition: 'all 0.12s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.color = '#94A3B8';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              (e.currentTarget as HTMLElement).style.color = '#64748B';
            }}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {showExpanded && (
              <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 500, color: '#64748B' }}>
                Collapse
              </span>
            )}
          </button>
        </div>

        {/* User card */}
        <div style={{
          padding: '12px 8px', borderTop: '1px solid #1F2937',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.12)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 6, flexShrink: 0,
            background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: 'white',
          }}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>

          <AnimatePresence>
            {showExpanded && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
              >
                <div style={{
                  fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user?.name ?? 'User'}
                </div>
                <div style={{
                  fontSize: 11, color: '#94A3B8',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user?.email}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showExpanded && (
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748B', padding: 5, borderRadius: 6,
                transition: 'all 0.12s ease', flexShrink: 0,
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.15)';
                (e.currentTarget as HTMLElement).style.color = '#EF4444';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'none';
                (e.currentTarget as HTMLElement).style.color = '#64748B';
              }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* MAIN AREA */}
      <div
        className="main-content-layout"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          position: 'relative', minHeight: 0,
        }}
      >
        {/* TOP BAR */}
        <header style={{
          height: 56, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          background: '#111827',
          borderBottom: '1px solid #1F2937',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flexGrow: 1 }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="mobile-menu-btn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid #1F2937',
                borderRadius: 8, padding: 7, cursor: 'pointer',
                color: '#94A3B8', transition: 'all 0.12s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1F2937'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Menu size={15} />
            </button>

            {/* Breadcrumbs */}
            <nav style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: '#64748B',
            }}>
              <span style={{ color: '#94A3B8', fontWeight: 500 }}>Platform</span>
              {pathnames.map((val, idx) => {
                const isLast = idx === pathnames.length - 1;
                const label = val.charAt(0).toUpperCase() + val.slice(1);
                return (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#1F2937' }}>/</span>
                    <span style={{
                      color: isLast ? '#FFFFFF' : '#94A3B8',
                      fontWeight: isLast ? 600 : 400,
                    }}>
                      {label}
                    </span>
                  </span>
                );
              })}
            </nav>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Search */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: '#1F2937', border: '1px solid #374151',
                color: '#94A3B8', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, transition: 'all 0.12s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#4B5563';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#374151';
                (e.currentTarget as HTMLElement).style.color = '#94A3B8';
              }}
            >
              <Search size={13} />
              <span className="hidden-xs">Search</span>
              <kbd style={{
                padding: '1px 5px', borderRadius: 5, fontSize: 10,
                background: '#374151', border: '1px solid #4B5563', color: '#94A3B8',
              }}>⌘K</kbd>
            </button>

            {/* AI badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 100,
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
              color: '#3B82F6', fontSize: 11, fontWeight: 600,
            }}>
              <Zap size={10} style={{ fill: '#3B82F6' }} />
              <span className="hidden-xs">AI Active</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: '1px solid #1F2937',
                  borderRadius: 8, padding: 7, cursor: 'pointer',
                  color: '#94A3B8', position: 'relative', transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1F2937'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#EF4444', border: '1.5px solid #111827',
                  }} />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: 320, zIndex: 50, borderRadius: 12,
                        background: '#111827', border: '1px solid #1F2937',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderBottom: '1px solid #1F2937',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flexGrow: 1 }}>Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 12, color: '#3B82F6', fontWeight: 500,
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ padding: 8 }}>
                        {notifications.map(n => (
                          <div key={n.id} style={{
                            padding: '10px 10px', borderRadius: 8,
                            background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                            marginBottom: 2,
                            borderLeft: n.read ? 'none' : '3px solid #3B82F6',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flexGrow: 1 }}>
                                {n.title}
                              </span>
                              <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{n.time}</span>
                            </div>
                            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3, lineHeight: 1.5 }}>
                              {n.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: accent,
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13, color: 'white',
                  transition: 'opacity 0.12s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: 200, zIndex: 50, borderRadius: 10,
                        background: '#111827', border: '1px solid #1F2937',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #1F2937' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
                          {user?.name ?? 'User'}
                        </div>
                        <div style={{
                          fontSize: 11, color: '#94A3B8', marginTop: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {user?.email}
                        </div>
                      </div>
                      <div style={{ padding: 6 }}>
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                            borderRadius: 7, textDecoration: 'none',
                            fontSize: 13, color: '#F1F5F9', transition: 'background 0.1s ease',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1F2937'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                        >
                          <UserIcon size={13} style={{ color: '#94A3B8' }} /> My Dashboard
                        </Link>
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                            borderRadius: 7, background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 13, color: '#EF4444', width: '100%', transition: 'background 0.1s ease',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <LogOut size={13} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          overflowY: 'auto', overflowX: 'hidden',
          background: '#0B1220', padding: '32px 32px',
        }}>
          <div className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col min-h-0 space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Global AI assistant */}
      <FloatingChatButton />

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            position: static !important;
            transform: none !important;
          }
          .mobile-close { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          .main-content-layout { margin-left: 0px !important; }
        }
        @media (max-width: 1023px) {
          .sidebar {
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            width: 240px !important;
          }
          .main-content-layout { margin-left: 0px !important; }
        }
        @media (max-width: 480px) {
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </div>
  );
}
