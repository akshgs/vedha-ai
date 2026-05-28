import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chatbot from './pages/Chatbot'
import Trends from './pages/Trends'
import Resume from './pages/Resume'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('vedha_token')
  if (!token) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><Chatbot /></ProtectedRoute>
        } />
        <Route path="/trends" element={
          <ProtectedRoute><Trends /></ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute><Resume /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App