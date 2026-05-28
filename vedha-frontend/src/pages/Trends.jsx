import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import API from '../api/client'

export default function Trends() {
  const [trends, setTrends] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const trendRes = await API.get('/api/trends/trends')
      setTrends(trendRes.data)
      const predRes = await API.get('/api/predict/top-skills')
      setPredictions(predRes.data)
    } catch (err) {
      console.log('Error:', err)
    }
    setLoading(false)
  }

  const colors = ['#7c6ef7', '#1D9E75', '#D85A30', '#378ADD', '#BA7517']

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.back} onClick={() => navigate('/dashboard')}>← Back</span>
        <span style={s.title}>📈 Live Skill Trends</span>
        <span style={s.subtitle}>ML Predictions — Kerala 2026</span>
      </div>

      <div style={s.content}>
        {loading ? (
          <div style={s.loading}>Loading live data...</div>
        ) : (
          <>
            {/* ML Predictions Chart */}
            {predictions?.top_5_skills_kerala_2026 && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>
                  🤖 ML Predicted Top Skills (RandomForest R²=0.85)
                </h2>
                <div style={s.chartBox}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={predictions.top_5_skills_kerala_2026}>
                      <XAxis dataKey="skill" tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: '#13131f',
                          border: '1px solid #2a2a4a'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="demand_score" radius={[6, 6, 0, 0]}>
                        {predictions.top_5_skills_kerala_2026.map((_, i) => (
                          <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={s.grid}>
                  {predictions.top_5_skills_kerala_2026.map((skill, i) => (
                    <div
                      key={i}
                      style={{ ...s.skillCard, borderLeft: `3px solid ${colors[i]}` }}
                    >
                      <div style={s.rank}>#{skill.rank}</div>
                      <div style={s.skillName}>{skill.skill}</div>
                      <div style={s.score}>{skill.demand_score}</div>
                      <div style={s.trend}>{skill.trend}</div>
                      <div style={s.action}>{skill.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Demand */}
            {trends?.skill_demand && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>💼 Hiring Demand</h2>
                <div style={s.grid}>
                  {trends.skill_demand.map((item, i) => (
                    <div key={i} style={s.demandCard}>
                      <div style={s.demandSkill}>{item.skill}</div>
                      <div style={s.demandMentions}>{item.mentions} mentions</div>
                      <div style={{
                        ...s.demandTrend,
                        color: item.trend.includes('↑') ? '#1D9E75' : '#888'
                      }}>
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Trending — fixed: <a> replaced with <div> */}
            {trends?.github_trending && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>⭐ GitHub Trending</h2>
                <div style={s.repoList}>
                  {trends.github_trending.map((repo, i) => (
                    <div
                      key={i}
                      style={s.repoCard}
                      onClick={() => window.open(repo.url, '_blank')}
                    >
                      <div style={s.repoName}>{repo.name}</div>
                      <div style={s.repoDesc}>
                        {repo.description?.slice(0, 80)}...
                      </div>
                      <div style={s.repoStats}>
                        ⭐ {repo.stars?.toLocaleString()} · {repo.language}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {trends?.ai_analysis && (
              <div style={s.section}>
                <h2 style={s.sectionTitle}>🧠 AI Market Analysis</h2>
                <div style={s.analysisBox}>{trends.ai_analysis}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a12' },
  header: {
    background: '#13131f', padding: '16px 24px',
    borderBottom: '1px solid #2a2a4a',
    display: 'flex', alignItems: 'center', gap: '16px',
    position: 'sticky', top: 0, zIndex: 100,
  },
  back: { color: '#7c6ef7', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '16px', fontWeight: '600' },
  subtitle: { fontSize: '12px', color: '#666', marginLeft: 'auto' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  loading: {
    textAlign: 'center', color: '#666',
    padding: '60px', fontSize: '16px',
  },
  section: { marginBottom: '40px' },
  sectionTitle: {
    fontSize: '16px', fontWeight: '600',
    color: '#ccc', marginBottom: '16px',
  },
  chartBox: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '14px', padding: '20px', marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '12px',
  },
  skillCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '16px',
  },
  rank: { fontSize: '11px', color: '#666', marginBottom: '4px' },
  skillName: { fontSize: '15px', fontWeight: '600', marginBottom: '4px' },
  score: {
    fontSize: '24px', fontWeight: '700',
    color: '#7c6ef7', marginBottom: '4px',
  },
  trend: { fontSize: '12px', color: '#1D9E75', marginBottom: '4px' },
  action: { fontSize: '11px', color: '#666' },
  demandCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '10px', padding: '14px',
  },
  demandSkill: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' },
  demandMentions: { fontSize: '12px', color: '#7c6ef7', marginBottom: '4px' },
  demandTrend: { fontSize: '12px' },
  repoList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  repoCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '10px', padding: '14px',
    cursor: 'pointer', color: 'white',
  },
  repoName: {
    fontSize: '14px', fontWeight: '600',
    color: '#7c6ef7', marginBottom: '4px',
  },
  repoDesc: { fontSize: '12px', color: '#888', marginBottom: '6px' },
  repoStats: { fontSize: '11px', color: '#666' },
  analysisBox: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '20px',
    fontSize: '14px', lineHeight: '1.8',
    color: '#ccc', whiteSpace: 'pre-wrap',
  },
}