import { cn } from '@/lib/utils'

interface Props {
    percent: number
    salary: number
    obligations: number
}

export default function SalaryLockBar({ percent, salary, obligations }: Props) {
    const intent = percent >= 60 ? 'danger' : percent >= 40 ? 'warning' : 'safe'
    const barColor = intent === 'danger' ? 'bg-red-500' : intent === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
    const textColor = intent === 'danger' ? 'text-red-400' : intent === 'warning' ? 'text-yellow-400' : 'text-green-400'
    const message = intent === 'danger'
    ? 'Your salary is heavily committed. Be cautios adding more.'
    : intent === 'warning'
    ? 'Over 40% of your salary is allocated to installments.'
    : 'Your installment load is manageable.'

    return (
        <>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
            <p className="text-white font-medium text-sm">Salary Lock</p>
            <span className={cn('text-sm font-bold', textColor)}>{percent.toFixed(1)}%</span>
        </div>
        <p className="text-zinc-500 text-xs mb-3">
        ₱{obligations.toLocaleString()} of ₱{salary.toLocaleString()} committed
        </p>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
                className={cn('h-full rounded-full transition-all', barColor)}
                style={{ width: `${Math.min(percent, 100)}%` }}
            />
        </div>
        <p className={cn('text-xs mt-2', textColor)}>{message}</p>
        </div>
    </>
    )
}