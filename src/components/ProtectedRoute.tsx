import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const {user, loading} = useAuth()

    if (loading) return (
        <div className='min-h-screen flex items-center justify-center bg-zinc-950'>
            <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
        </div>
    )

    if (!user) return <Navigate to='/login' replace />

    return <> { children } </>
}