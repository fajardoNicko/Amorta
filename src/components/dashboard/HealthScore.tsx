import { cn } from '@/lib/utils'

interface Props {
  score: number
}

export default function HealthScore({ score }: Props) {
  const intent = score >= 80 ? 'safe' : score >= 60 ? 'warning' : 'danger'
  const color = intent === 'safe' ? '#22c55e' : intent === 'warning' ? '#eab308' : '#ef4444'
  const label = intent === 'safe' ? 'Healthy' : intent === 'warning' ? 'Moderate Risk' : 'High Risk'
  const textColor = intent === 'safe' ? 'text-green-400' : intent === 'warning' ? 'text-yellow-400' : 'text-red-400'

  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-5">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-zinc-500 text-xs">Financial Health Score</p>
        <p className={cn('text-lg font-bold mt-0.5', textColor)}>{label}</p>
        <p className="text-zinc-500 text-xs mt-1">
          {intent === 'safe'
            ? 'Great job keeping your debt load low.'
            : intent === 'warning'
            ? 'Consider paying off some installments soon.'
            : 'Your debt load is dangerously high.'}
        </p>
      </div>
    </div>
  )
}