import { NavLink } from 'react-router-dom'
// import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { LayoutDashboard, CreditCard, Calculator, Bell, Settings } from 'lucide-react'

const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tracker', label: 'Tracker', icon: CreditCard },
    { to: '/simulator', label: 'Simulator', icon: Calculator },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings }
]

export default function MobileNav() {
    return (
    <>
        <nav className='fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around px-2 py-2 z-50 md:hidden'>
            {nav.map(({ to, icon: Icon, label}) => (
                <NavLink key={to} to={to} className={({ isActive }) => cn('flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', isActive ? 'text-white' : 'text-zinc-500')}>
                    <Icon size={18} />
                    {label}
                </NavLink>
            ))}
        </nav>
    </>
    )
}