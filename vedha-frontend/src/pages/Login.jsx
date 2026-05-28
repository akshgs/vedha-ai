import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/client'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill all fields!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const body = isRegister
        ? { name, email, password, goal: 'Student' }
        : { email, password }

      const res = await API.post(endpoint, body)
      localStorage.setItem('vedha_token', res.data.token)
      localStorage.setItem('vedha_user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong!')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🎓</div>
        <h1 style={s.title}>Vedha AI</h1>
        <p style={s.subtitle}>Kerala's AI Career Platform</p>

        <div style={s.tabs}>
          <button
            style={!isRegister ? s.tabActive : s.tab}
            onClick={() => setIsRegister(false)}
          >Login</button>
          <button
            style={isRegister ? s.tabActive : s.tab}
            onClick={() => setIsRegister(true)}
          >Register</button>
        </div>

        {isRegister && (
          <input
            style={s.input}
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          style={s.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={s.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p style={s.error}>{error}</p>}

        <button
          style={loading ? s.btnOff : s.btn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a12 0%, #1a0a2e 100%)',
  },
  card: {
    background: '#13131f',
    border: '1px solid #2a2a4a',
    borderRadius: '20px',
    padding: '40px 36px',
    width: '380px',
    boxShadow: '0 20px 60px rgba(124,110,247,0.15)',
  },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '8px' },
  title: {
    fontSize: '26px', fontWeight: '700',
    textAlign: 'center', color: '#7c6ef7', marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px', color: '#666',
    textAlign: 'center', marginBottom: '28px',
  },
  tabs: {
    display: 'flex', borderRadius: '10px',
    border: '1px solid #2a2a4a', overflow: 'hidden', marginBottom: '20px',
  },
  tab: {
    flex: 1, padding: '10px', background: 'transparent',
    color: '#666', border: 'none', cursor: 'pointer', fontSize: '14px',
  },
  tabActive: {
    flex: 1, padding: '10px', background: '#7c6ef7',
    color: 'white', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
  },
  input: {
    width: '100%', padding: '13px 14px', marginBottom: '12px',
    background: '#0a0a12', border: '1px solid #2a2a4a',
    borderRadius: '10px', color: 'white', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '14px', background: '#7c6ef7',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px',
  },
  btnOff: {
    width: '100%', padding: '14px', background: '#2a2a4a',
    color: '#666', border: 'none', borderRadius: '10px',
    fontSize: '15px', cursor: 'not-allowed', marginTop: '4px',
  },
  error: {
    color: '#ff6b6b', fontSize: '13px',
    marginBottom: '10px', textAlign: 'center',
  },
}