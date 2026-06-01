import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<div>Landing</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/signup" element={<div>Signup</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/tracker" element={<div>Tracker</div>} />
        <Route path="/simulator" element={<div>Simulator</div>} />
        <Route path="/notifications" element={<div>Notifications</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </div>
  )
}