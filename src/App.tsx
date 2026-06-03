import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Tracker from '@/pages/Tracker'

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
        // with
        <Route path="/tracker" element={
          <ProtectedRoute><Tracker /></ProtectedRoute>
        } />
        <Route path="/simulator" element={
          <ProtectedRoute><AppLayout><div>Simulator</div></AppLayout></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><AppLayout><div>Notifications</div></AppLayout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><AppLayout><div>Settings</div></AppLayout></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}