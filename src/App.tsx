import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Tracker from '@/pages/Tracker'
import Settings from '@/pages/Settings'
import Simulator from '@/pages/Simulator'
import Notifications from '@/pages/Notifications'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/tracker" element={
          <ProtectedRoute><Tracker /></ProtectedRoute>
        } />
        <Route path="/simulator" element={
          <ProtectedRoute><Simulator /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><Notifications /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}