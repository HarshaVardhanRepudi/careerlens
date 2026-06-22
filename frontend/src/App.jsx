import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout, ProtectedRoute } from './components/layout/Layout'

import Login         from './pages/Login'
import Register      from './pages/Register'
import Dashboard     from './pages/Dashboard'
import ResumeUpload  from './pages/ResumeUpload'
import ATSAnalyzer   from './pages/ATSAnalyzer'
import Tracker       from './pages/Tracker'
import Analytics     from './pages/Analytics'
import Profile       from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="resume"     element={<ResumeUpload />} />
            <Route path="ats"        element={<ATSAnalyzer />} />
            <Route path="tracker"    element={<Tracker />} />
            <Route path="analytics"  element={<Analytics />} />
            <Route path="profile"    element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
