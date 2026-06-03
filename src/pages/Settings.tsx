import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { cn } from '@/lib/utils'
import { User, Wallet, LogOut, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const inputClass = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
const labelClass = "block text-zinc-400 text-xs mb-1"

export default function Settings() {
  const { profile, loading, update } = useUser()
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [salary, setSalary] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setSalary(profile.monthly_salary?.toString() ?? '')
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const err = await update({
      full_name: fullName,
      monthly_salary: parseFloat(salary) || 0,
    })
    if (err) setError('Failed to save. Please try again.')
    else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return
    setDeleting(true)
    await supabase.from('installments').delete().eq('user_id', user?.id)
    await supabase.from('notifications').delete().eq('user_id', user?.id)
    await supabase.from('profiles').delete().eq('id', user?.id)
    await signOut()
    navigate('/login')
    setDeleting(false)
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage your profile and preferences.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">

            {/* Profile */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User size={15} className="text-zinc-400" />
                <h3 className="text-white font-medium text-sm">Profile</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    className={inputClass}
                    placeholder="Your name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    className={cn(inputClass, 'opacity-50 cursor-not-allowed')}
                    value={user?.email ?? ''}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Financial */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={15} className="text-zinc-400" />
                <h3 className="text-white font-medium text-sm">Financial Info</h3>
              </div>
              <div>
                <label className={labelClass}>Monthly Salary (₱)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="e.g. 25000"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                />
                <p className="text-zinc-600 text-xs mt-1">Used to calculate salary lock and health score.</p>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                'w-full bg-white text-zinc-950 rounded-lg py-2.5 text-sm font-medium transition-colors',
                saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'
              )}
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>

            {/* Delete account */}
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg py-2.5 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={15} />
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>

          </div>
        )}
      </div>
    </AppLayout>
  )
}