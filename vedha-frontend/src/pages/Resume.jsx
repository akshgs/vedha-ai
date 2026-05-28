import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/client'

export default function Resume() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('ML Engineer')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const roles = [
    'ML Engineer', 'Data Scientist', 'Full Stack Developer',
    'NLP Engineer', 'DevOps Engineer', 'Prompt Engineer',
    'MLOps Engineer', 'GenAI Developer', 'LLM Engineer',
  ]

  const handleScan = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_role', role)

    try {
      const res = await API.post('/api/resume/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Scan failed!')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.back} onClick={() => navigate('/dashboard')}>← Back</span>
        <span style={s.title}>📄 Resume Scanner</span>
        <span style={s.subtitle}>NLP + Semantic Matching</span>
      </div>

      <div style={s.content}>
        <div style={s.uploadCard}>
          <h2 style={s.cardTitle}>Upload Your Resume</h2>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={e => setFile(e.target.files[0])}
            style={s.fileInput}
          />
          {file && <p style={s.fileName}>📎 {file.name}</p>}

          <label style={s.label}>Target Role</label>
          <select
            style={s.select}
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <button
            style={loading || !file ? s.btnOff : s.btn}
            onClick={handleScan}
            disabled={loading || !file}
          >
            {loading ? 'Analyzing...' : 'Scan Resume'}
          </button>
        </div>

        {result && (
          <div style={s.results}>
            <div style={s.scoreCard}>
              <div style={s.scoreBig}>
                {result.match_result?.match_percent}%
              </div>
              <div style={s.scoreLabel}>Match for {result.target_role}</div>
            </div>

            <div style={s.skillsCard}>
              <h3 style={s.cardTitle}>
                ✅ Skills Found ({result.total_skills_found})
              </h3>
              <div style={s.tags}>
                {result.extracted_skills?.map((skill, i) => (
                  <span key={i} style={s.tagGreen}>{skill}</span>
                ))}
              </div>
            </div>

            <div style={s.skillsCard}>
              <h3 style={s.cardTitle}>❌ Missing Skills</h3>
              <div style={s.tags}>
                {result.match_result?.missing_skills?.map((skill, i) => (
                  <span key={i} style={s.tagRed}>{skill}</span>
                ))}
              </div>
            </div>

            <div style={s.feedbackCard}>
              <h3 style={s.cardTitle}>🤖 AI Career Advice</h3>
              <p style={s.feedback}>{result.ai_feedback}</p>
            </div>
          </div>
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
  },
  back: { color: '#7c6ef7', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '16px', fontWeight: '600' },
  subtitle: { fontSize: '12px', color: '#666', marginLeft: 'auto' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  uploadCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '16px', padding: '28px', marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px', fontWeight: '600', marginBottom: '16px',
  },
  fileInput: { width: '100%', padding: '12px', marginBottom: '8px', color: '#ccc' },
  fileName: { color: '#7c6ef7', fontSize: '13px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' },
  select: {
    width: '100%', padding: '12px', marginBottom: '16px',
    background: '#0a0a12', border: '1px solid #2a2a4a',
    borderRadius: '10px', color: 'white', fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '14px', background: '#7c6ef7',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
  btnOff: {
    width: '100%', padding: '14px', background: '#2a2a4a',
    color: '#666', border: 'none', borderRadius: '10px',
    fontSize: '15px', cursor: 'not-allowed',
  },
  results: { display: 'flex', flexDirection: 'column', gap: '16px' },
  scoreCard: {
    background: '#13131f', border: '1px solid #7c6ef7',
    borderRadius: '16px', padding: '28px', textAlign: 'center',
  },
  scoreBig: { fontSize: '56px', fontWeight: '700', color: '#7c6ef7' },
  scoreLabel: { fontSize: '14px', color: '#888', marginTop: '6px' },
  skillsCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '20px',
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  tagGreen: {
    background: 'rgba(29,158,117,0.15)', color: '#1D9E75',
    border: '1px solid rgba(29,158,117,0.3)',
    borderRadius: '20px', padding: '4px 12px', fontSize: '12px',
  },
  tagRed: {
    background: 'rgba(226,75,74,0.15)', color: '#E24B4A',
    border: '1px solid rgba(226,75,74,0.3)',
    borderRadius: '20px', padding: '4px 12px', fontSize: '12px',
  },
  feedbackCard: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px', padding: '20px',
  },
  feedback: {
    fontSize: '14px', lineHeight: '1.8',
    color: '#ccc', whiteSpace: 'pre-wrap',
  },
}