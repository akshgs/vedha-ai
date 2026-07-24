import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";

import Landing from "@/pages/landing/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Student Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Resume from "@/pages/resume/Resume";
import Jobs from "@/pages/jobs/Jobs";
import Roadmap from "@/pages/roadmap/Roadmap";
import Interview from "@/pages/interview/Interview";
import InterviewHistory from "@/pages/interview/InterviewHistory";
import InterviewReport from "@/pages/interview/InterviewReport";
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/student/Settings";

// Company Pages
import CompanyDashboard from "@/pages/company/Dashboard";
import CompanyProfile from "@/pages/company/Profile";
import CompanyJobs from "@/pages/company/Jobs";
import CompanyApplicants from "@/pages/company/Applicants";
import CompanyInterviews from "@/pages/company/Interviews";
import CompanyAnalytics from "@/pages/company/Analytics";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCompanies from "@/pages/admin/Companies";
import CompanyApproval from "@/pages/admin/CompanyApproval";

// Error Pages
import { NotFound, Forbidden } from "@/pages/errors/ErrorPages";

import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardRedirector from "@/pages/dashboard/DashboardRedirector";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" theme="dark" closeButton richColors />
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected General Redirector */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirector />
              </ProtectedRoute>
            }
          />

          {/* Student Portal Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/resume"
            element={
              <ProtectedRoute role="student">
                <Resume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute role="student">
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/roadmap"
            element={
              <ProtectedRoute role="student">
                <Roadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/interview"
            element={
              <ProtectedRoute role="student">
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/interview/history"
            element={
              <ProtectedRoute role="student">
                <InterviewHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/interview/report/:interviewId"
            element={
              <ProtectedRoute role="student">
                <InterviewReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/settings"
            element={
              <ProtectedRoute role="student">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Company Portal Protected Routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/profile"
            element={
              <ProtectedRoute role="company">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/jobs"
            element={
              <ProtectedRoute role="company">
                <CompanyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/applicants"
            element={
              <ProtectedRoute role="company">
                <CompanyApplicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/interviews"
            element={
              <ProtectedRoute role="company">
                <CompanyInterviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/analytics"
            element={
              <ProtectedRoute role="company">
                <CompanyAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute role="admin">
                <AdminCompanies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute role="admin">
                <CompanyApproval />
              </ProtectedRoute>
            }
          />

          {/* Fallback Legacy Flat Route Redirects */}
          <Route path="/resume" element={<Navigate to="/student/resume" replace />} />
          <Route path="/jobs" element={<Navigate to="/student/jobs" replace />} />
          <Route path="/roadmap" element={<Navigate to="/student/roadmap" replace />} />
          <Route path="/interview" element={<Navigate to="/student/interview" replace />} />
          <Route path="/interview/history" element={<Navigate to="/student/interview/history" replace />} />
          <Route path="/interview/report/:interviewId" element={<Navigate to="/student/interview/report/:interviewId" replace />} />
          <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
          <Route path="/settings" element={<Navigate to="/student/settings" replace />} />

          {/* Error Page Redirects */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}