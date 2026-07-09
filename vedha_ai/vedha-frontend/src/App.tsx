import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Resume from "./pages/resume/Resume";
import Jobs from "./pages/jobs/Jobs";
import Roadmap from "./pages/roadmap/Roadmap";
import Interview from "./pages/interview/Interview";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;