import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/client'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [skills, setSkills] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('vedha_user')
    if (userData) setUser(JSON.parse(userData))
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await API.get('/api/skills/roles')
      setSkills(res.data)
    } catch (err) {
      console.log('Skills error:', err)
    }
  }

  const logout = () => {
    localStorage.removeItem('vedha_token')
    localStorage.removeItem('vedha_user')
    navigate('/login')
  }

  const modules = [
    { icon: '💬', title: 'AI Chatbot', desc: 'Career guidance', path: '/chat', color: '#7c6ef7' },
    { icon: '📄', title: 'Resume Scanner', desc: 'NLP skill match', path: '/resume', color: '#1D9E75' },
    { icon: '📈', title: 'Trend Tracker', desc: 'ML predictions', path: '/trends', color: '#D85A30' },
    { icon: '🎥', title: 'Mock Interview', desc: 'OpenCV + Whisper', path: '/interview', color: '#378ADD' },
    { icon: '💻', title: 'LeetCode', desc: 'AI hints + practice', path: '/leetcode', color: '#BA7517' },
    { icon: '🏆', title: 'Leaderboard', desc: 'Kerala rankings', path: '/leaderboard', color: '#E24B4A' },
  ]

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navLogo}>🎓 Vedha AI</span>
        <div style={s.navLinks}>
          <span style={s.navLink} onClick={() => navigate('/chat')}>Chat</span>
          <span style={s.navLink} onClick={() => navigate('/trends')}>Trends</span>
          <span style={s.navLink} onClick={() => navigate('/resume')}>Resume</span>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={s.content}>
        <div style={s.welcome}>
          <h1 style={s.welcomeTitle}>
            Welcome, {user?.name || 'Student'} 👋
          </h1>
          <p style={s.welcomeSub}>Kerala's AI-powered career guidance platform</p>
        </div>

        <div style={s.statsRow}>
          {[
            { label: 'ML Model R²', value: '0.85', color: '#1D9E75' },
            { label: 'Skills Tracked', value: '14', color: '#7c6ef7' },
            { label: 'Kerala Roles', value: '15', color: '#D85A30' },
            { label: 'Modules', value: '11', color: '#378ADD' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statNum, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={s.sectionTitle}>Platform Modules</h2>
        <div style={s.grid}>
          {modules.map((mod, i) => (
            <div
              key={i}
              style={{ ...s.modCard, borderTop: `3px solid ${mod.color}` }}
              onClick={() => navigate(mod.path)}
            >
              <div style={s.modIcon}>{mod.icon}</div>
              <div style={s.modTitle}>{mod.title}</div>
              <div style={s.modDesc}>{mod.desc}</div>
              <div style={{ ...s.modArrow, color: mod.color }}>→</div>
            </div>
          ))}
        </div>

        {skills && (
          <div>
            <h2 style={s.sectionTitle}>
              2026 Kerala IT Roles ({skills.total_roles})
            </h2>
            <div style={s.rolesGrid}>
              {skills.roles?.slice(0, 6).map((role, i) => (
                <div key={i} style={s.roleCard}>
                  <div style={s.roleName}>{role.role}</div>
                  <div style={s.roleSkills}>{role.skills_required} skills required</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a12' },
  nav: {
    background: '#13131f', padding: '16px 32px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #2a2a4a',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { fontSize: '18px', fontWeight: '700', color: '#7c6ef7' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '24px' },
  navLink: { color: '#888', fontSize: '14px', cursor: 'pointer' },
  logoutBtn: {
    padding: '6px 16px', background: 'transparent',
    border: '1px solid #2a2a4a', borderRadius: '8px',
    color: '#888', cursor: 'pointer', fontSize: '13px',
  },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  welcome: { marginBottom: '32px' },
  welcomeTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '6px' },
  welcomeSub: { color: '#666', fontSize: '15px' },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px', marginBottom: '36px',
  },
  statCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '20px', textAlign: 'center',
  },
  statNum: { fontSize: '28px', fontWeight: '700' },
  statLabel: { fontSize: '12px', color: '#666', marginTop: '4px' },
  sectionTitle: {
    fontSize: '18px', fontWeight: '600',
    marginBottom: '16px', color: '#ccc',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px', marginBottom: '36px',
  },
  modCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '20px', cursor: 'pointer',
  },
  modIcon: { fontSize: '28px', marginBottom: '10px' },
  modTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '4px' },
  modDesc: { fontSize: '12px', color: '#666', marginBottom: '12px' },
  modArrow: { fontSize: '18px', fontWeight: '700' },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '10px',
  },
  roleCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '10px', padding: '14px',
  },
  roleName: { fontSize: '13px', fontWeight: '500', marginBottom: '4px' },
  roleSkills: { fontSize: '11px', color: '#666' },
}