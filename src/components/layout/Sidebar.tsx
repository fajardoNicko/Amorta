import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { LayoutDashboard, CreditCard, Calculator, Bell, Settings, LogOut } from 'lucide-react'

const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tracker', label: 'Tracker', icon: CreditCard },
    { to: '/simulator', label: 'Simulator', icon: Calculator },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <>
        <aside className='fixed left-0 top-0 h-screen w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50'>
            <div className="px-6 py-5 border-b border-zinc-800">
                <h1 className='text-lg font-bold text-white tracking-tight'>Amorta</h1>
                <p className='text-zinc-500 text-xs mt-0.5 truncate'>{user?.email}</p>
            </div>
            {/* Nav Bar */}

            <nav className='flex-1 px-3 py-4 space-y-1'>
                {nav.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    )}>
                        <Icon size={16} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className='px-3 py-4 border-t border-zinc-800'>
                <button onClick={handleSignOut} className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors w-full'>
                    <LogOut size={16}>
                        Sign Out
                    </LogOut>
                </button>
            </div>
        </aside>
        </>
    )
}