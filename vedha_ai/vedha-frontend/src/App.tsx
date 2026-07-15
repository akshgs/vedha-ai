import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";

import Landing from "@/pages/landing/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import Dashboard from "@/pages/dashboard/Dashboard";
import Resume from "@/pages/resume/Resume";
import Jobs from "@/pages/jobs/Jobs";
import Roadmap from "@/pages/roadmap/Roadmap";
import Interview from "@/pages/interview/Interview";

import ProtectedRoute from "@/routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          {/* Settings (Coming Soon) */}
          <Route
            path="/settings"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}