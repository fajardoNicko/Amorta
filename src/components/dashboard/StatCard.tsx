import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
    label: string
    value: string
    sub?: string
    icon: LucideIcon
    intent?: 'default' | 'safe' | 'warning' | 'danger'
}

const intentStyles = {
    default: 'text-white',
    safe: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
}

export default function StatCard({ label, value, sub, icon: Icon, intent = 'default' }: Props) {
    return (
        <>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
                <p className='text-zinc-500 text-xs'>{label}</p>
                <Icon size={14} className='text-zinc-600' />
            </div>
            <p className={cn('text-2xl font-bold', intentStyles[intent])}>{value}</p>
            {sub && <p className='text-zinc-500 text-xs mt-1'>{sub}</p>}
        </div>
        </>
    )
}