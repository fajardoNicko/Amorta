import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Check } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = password.length === 0 ? null : password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong'
  const strengthColor = passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
  const strengthWidth = passwordStrength === 'weak' ? 'w-1/3' : passwordStrength === 'medium' ? 'w-2/3' : 'w-full'

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 border-r border-zinc-800 flex-col justify-between p-12">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Amorta</h1>
        </div>
        <div className="space-y-4">
          {[
            'Track all your installments in one place',
            'Know exactly how much of your salary is committed',
            'Get AI-powered financial insights',
            'Visualize your debt load over time',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <Check size={10} className="text-green-400" />
              </div>
              <p className="text-zinc-400 text-sm">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-zinc-700 text-xs">Free forever. No credit card required.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-white">Amorta</h1>
            <p className="text-zinc-500 text-sm mt-1">Know what your salary is really for.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">Create your account</h2>
            <p className="text-zinc-500 text-sm mt-1">Start tracking your installments for free</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm font-medium transition-all hover:border-zinc-600"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-600 text-xs">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none"
              />
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', strengthColor, strengthWidth)} />
                    </div>
                    <p className={cn('text-xs mt-1', passwordStrength === 'weak' ? 'text-red-400' : passwordStrength === 'medium' ? 'text-yellow-400' : 'text-green-400')}>
                      {passwordStrength === 'weak' ? 'Weak password' : passwordStrength === 'medium' ? 'Medium strength' : 'Strong password'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className={cn(
                'w-full bg-white text-zinc-950 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-100 active:scale-[0.99]'
              )}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-zinc-600 text-xs pt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-zinc-300 hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}