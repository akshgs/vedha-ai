import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardRedirector from "@/pages/dashboard/DashboardRedirector";
import Loader from "@/components/ui/loading/Loader";

// Lazy Loaded Pages
const Landing = lazy(() => import("@/pages/landing/Landing"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTP"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Onboarding = lazy(() => import("@/pages/auth/Onboarding"));

// Student Pages
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Resume = lazy(() => import("@/pages/resume/Resume"));
const Jobs = lazy(() => import("@/pages/jobs/Jobs"));
const Roadmap = lazy(() => import("@/pages/roadmap/Roadmap"));
const Interview = lazy(() => import("@/pages/interview/Interview"));
const InterviewHistory = lazy(() => import("@/pages/interview/InterviewHistory"));
const InterviewReport = lazy(() => import("@/pages/interview/InterviewReport"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Settings = lazy(() => import("@/pages/student/Settings"));
const Skills = lazy(() => import("@/pages/student/Skills"));
const Coding = lazy(() => import("@/pages/student/Coding"));
const Career = lazy(() => import("@/pages/student/Career"));
const StudentAnalytics = lazy(() => import("@/pages/student/Analytics"));

// AI & Learning Platform Pages
const LearningCatalog = lazy(() => import("@/pages/learning/Catalog"));
const LearningDetails = lazy(() => import("@/pages/learning/Details"));
const LearningLesson = lazy(() => import("@/pages/learning/Lesson"));
const AICareerPredictor = lazy(() => import("@/pages/ai/CareerPredictor"));
const AIResearchAssistant = lazy(() => import("@/pages/ai/ResearchAssistant"));
const AIPdfChat = lazy(() => import("@/pages/ai/PdfChat"));

// Collaboration Pages
const CollaborationFeed = lazy(() => import("@/pages/collaboration/Feed"));
const CollaborationMentors = lazy(() => import("@/pages/collaboration/Mentors"));
const CollaborationMessages = lazy(() => import("@/pages/collaboration/Messages"));
const CollaborationPublicProfile = lazy(() => import("@/pages/collaboration/PublicProfile"));

// Coding Platform Pages
const CodingCatalog = lazy(() => import("@/pages/coding/Catalog"));
const CodingProblemDetails = lazy(() => import("@/pages/coding/Details"));
const CodingContests = lazy(() => import("@/pages/coding/Contests"));

// Recruitment Platform Pages
const RecruitmentMarketplace = lazy(() => import("@/pages/recruitment/Marketplace"));
const RecruitmentApplications = lazy(() => import("@/pages/recruitment/Applications"));
const RecruitmentInterviews = lazy(() => import("@/pages/recruitment/Interviews"));

// Employee Pages
const EmployeeDashboard = lazy(() => import("@/pages/employee/Dashboard"));
const EmployeeBlogs = lazy(() => import("@/pages/employee/Blogs"));
const EmployeeResumeReviews = lazy(() => import("@/pages/employee/ResumeReviews"));
const EmployeeMentorship = lazy(() => import("@/pages/employee/Mentorship"));
const EmployeeInterviewRequests = lazy(() => import("@/pages/employee/InterviewRequests"));
const EmployeeCommunity = lazy(() => import("@/pages/employee/Community"));
const EmployeeAnalytics = lazy(() => import("@/pages/employee/Analytics"));
const EmployeeProfile = lazy(() => import("@/pages/employee/Profile"));
const EmployeeSettings = lazy(() => import("@/pages/employee/Settings"));

// Recruiter Pages
const RecruiterDashboard = lazy(() => import("@/pages/recruiter/Dashboard"));
const RecruiterSearch = lazy(() => import("@/pages/recruiter/CandidateSearch"));
const RecruiterRanking = lazy(() => import("@/pages/recruiter/AIRanking"));
const RecruiterShortlist = lazy(() => import("@/pages/recruiter/Shortlisting"));
const RecruiterScheduling = lazy(() => import("@/pages/recruiter/InterviewScheduling"));
const RecruiterPipeline = lazy(() => import("@/pages/recruiter/HiringPipeline"));
const RecruiterAnalytics = lazy(() => import("@/pages/recruiter/Analytics"));
const RecruiterSettings = lazy(() => import("@/pages/recruiter/Settings"));

// Company Pages
const CompanyDashboard = lazy(() => import("@/pages/company/Dashboard"));
const CompanyProfile = lazy(() => import("@/pages/company/Profile"));
const CompanyJobs = lazy(() => import("@/pages/company/Jobs"));
const CompanyApplicants = lazy(() => import("@/pages/company/Applicants"));
const CompanyInterviews = lazy(() => import("@/pages/company/Interviews"));
const CompanyAnalytics = lazy(() => import("@/pages/company/Analytics"));
const CompanyInternships = lazy(() => import("@/pages/company/Internships"));
const CompanyInsights = lazy(() => import("@/pages/company/Insights"));
const CompanyEmployees = lazy(() => import("@/pages/company/Employees"));
const CompanyReports = lazy(() => import("@/pages/company/Reports"));
const CompanySettings = lazy(() => import("@/pages/company/Settings"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminCompanies = lazy(() => import("@/pages/admin/Companies"));
const CompanyApproval = lazy(() => import("@/pages/admin/CompanyApproval"));
const AdminProfile = lazy(() => import("@/pages/admin/Profile"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));

// Error Pages (static import — await import is invalid at module level)
import { NotFound, Forbidden } from "@/pages/errors/ErrorPages";
import ErrorBoundary from "@/components/ui/errors/ErrorBoundary";

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Toaster position="top-right" theme="dark" closeButton richColors />
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
              <Loader size="lg" label="Initializing Vedha Portal..." />
            </div>
          }>
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

            <Route
              path="/verify-otp"
              element={<VerifyOTP />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
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

            <Route
              path="/student/skills"
              element={
                <ProtectedRoute role="student">
                  <Skills />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/coding"
              element={
                <ProtectedRoute role="student">
                  <Coding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/career"
              element={
                <ProtectedRoute role="student">
                  <Career />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/analytics"
              element={
                <ProtectedRoute role="student">
                  <StudentAnalytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/learning"
              element={
                <ProtectedRoute role="student">
                  <LearningCatalog />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/learning/course/:id"
              element={
                <ProtectedRoute role="student">
                  <LearningDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/learning/course/:id/lesson/:lessonId"
              element={
                <ProtectedRoute role="student">
                  <LearningLesson />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/ai/predictor"
              element={
                <ProtectedRoute role="student">
                  <AICareerPredictor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/ai/research"
              element={
                <ProtectedRoute role="student">
                  <AIResearchAssistant />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/ai/pdf-chat"
              element={
                <ProtectedRoute role="student">
                  <AIPdfChat />
                </ProtectedRoute>
              }
            />

            {/* Collaboration Routes */}
            <Route
              path="/collaboration/feed"
              element={
                <ProtectedRoute>
                  <CollaborationFeed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/collaboration/mentors"
              element={
                <ProtectedRoute>
                  <CollaborationMentors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/collaboration/messages"
              element={
                <ProtectedRoute>
                  <CollaborationMessages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/collaboration/profile/:id"
              element={
                <ProtectedRoute>
                  <CollaborationPublicProfile />
                </ProtectedRoute>
              }
            />

            {/* Coding & Contest Routes */}
            <Route
              path="/coding/problems"
              element={
                <ProtectedRoute role="student">
                  <CodingCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding/problems/:id"
              element={
                <ProtectedRoute role="student">
                  <CodingProblemDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding/contests"
              element={
                <ProtectedRoute role="student">
                  <CodingContests />
                </ProtectedRoute>
              }
            />

            {/* Recruitment Routes */}
            <Route
              path="/recruitment/jobs"
              element={
                <ProtectedRoute role="student">
                  <RecruitmentMarketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruitment/applications"
              element={
                <ProtectedRoute role="student">
                  <RecruitmentApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruitment/interviews"
              element={
                <ProtectedRoute role="student">
                  <RecruitmentInterviews />
                </ProtectedRoute>
              }
            />

            {/* Employee Portal Protected Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/blogs"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/resumes"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeResumeReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/mentorship"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeMentorship />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/interviews"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeInterviewRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/community"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeCommunity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/analytics"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/settings"
              element={
                <ProtectedRoute role="employee">
                  <EmployeeSettings />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Portal Protected Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/search"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/ranking"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterRanking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/shortlist"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterShortlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/scheduling"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterScheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/pipeline"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterPipeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/analytics"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/settings"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterSettings />
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

            <Route
              path="/company/internships"
              element={
                <ProtectedRoute role="company">
                  <CompanyInternships />
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/insights"
              element={
                <ProtectedRoute role="company">
                  <CompanyInsights />
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/employees"
              element={
                <ProtectedRoute role="company">
                  <CompanyEmployees />
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/reports"
              element={
                <ProtectedRoute role="company">
                  <CompanyReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/settings"
              element={
                <ProtectedRoute role="company">
                  <CompanySettings />
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
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute role="admin">
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute role="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <AdminAnalytics />
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
        </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}