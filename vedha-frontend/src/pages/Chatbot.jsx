import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/client'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi! I am Vedha AI, your Kerala career mentor. How can I help you today? 🎓'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem('vedha_user') || '{}')
      const res = await API.post('/api/chat/chat', {
        student_id: user.id || 1,
        message: userMsg,
      })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, I am having trouble connecting. Please try again!'
      }])
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.back} onClick={() => navigate('/dashboard')}>← Back</span>
        <span style={s.title}>💬 Vedha AI Chatbot</span>
        <span style={s.subtitle}>Kerala Career Mentor</span>
      </div>

      <div style={s.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? s.userRow : s.aiRow}>
            {msg.role === 'ai' && <div style={s.avatar}>🤖</div>}
            <div style={msg.role === 'user' ? s.userBubble : s.aiBubble}>
              {msg.text}
            </div>
            {msg.role === 'user' && <div style={s.avatar}>👤</div>}
          </div>
        ))}
        {loading && (
          <div style={s.aiRow}>
            <div style={s.avatar}>🤖</div>
            <div style={s.aiBubble}>Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <input
          style={s.input}
          placeholder="Ask about career, skills, jobs in Kerala..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          style={loading ? s.btnOff : s.btn}
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  )
}

const s = {
  page: {
    display: 'flex', flexDirection: 'column',
    height: '100vh', background: '#0a0a12',
  },
  header: {
    background: '#13131f', padding: '16px 24px',
    borderBottom: '1px solid #2a2a4a',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  back: { color: '#7c6ef7', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '16px', fontWeight: '600' },
  subtitle: { fontSize: '12px', color: '#666', marginLeft: 'auto' },
  messages: {
    flex: 1, overflowY: 'auto',
    padding: '20px 24px',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  aiRow: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  userRow: {
    display: 'flex', alignItems: 'flex-start',
    gap: '10px', flexDirection: 'row-reverse',
  },
  avatar: { fontSize: '24px', flexShrink: 0 },
  aiBubble: {
    background: '#13131f', border: '1px solid #2a2a4a',
    borderRadius: '12px 12px 12px 0',
    padding: '12px 16px', fontSize: '14px',
    lineHeight: '1.6', maxWidth: '70%',
  },
  userBubble: {
    background: '#7c6ef7',
    borderRadius: '12px 12px 0 12px',
    padding: '12px 16px', fontSize: '14px',
    lineHeight: '1.6', maxWidth: '70%',
  },
  inputRow: {
    padding: '16px 24px', background: '#13131f',
    borderTop: '1px solid #2a2a4a',
    display: 'flex', gap: '12px',
  },
  input: {
    flex: 1, padding: '12px 16px',
    background: '#0a0a12', border: '1px solid #2a2a4a',
    borderRadius: '10px', color: 'white',
    fontSize: '14px', outline: 'none',
  },
  btn: {
    padding: '12px 24px', background: '#7c6ef7',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  btnOff: {
    padding: '12px 24px', background: '#2a2a4a',
    color: '#666', border: 'none', borderRadius: '10px',
    fontSize: '14px', cursor: 'not-allowed',
  },
}