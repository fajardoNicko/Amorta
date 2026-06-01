import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else navigate('/dashboard')
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {redirectTo: `${window.location.origin}/dashboard`},
        })
    }

    return (
        <>
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <h1 className='text-2xl font-bold text-white'>Amorta</h1>
                    <p className='text-zinc-400 text-sm mt-1'>Know what your salary is really for.</p>
                </div>
                <div className="space-y-3">
                    <button onClick={handleGoogleLogin} className='w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors'>
                        <img src='https://www.google.com/favicon.ico' alt='Google' className='w-4 h-4' />
                        Continue with Google
                    </button>

                </div>
            </div>
        </div>
        </>
    )
}
