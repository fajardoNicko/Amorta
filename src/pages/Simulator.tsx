import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useInstallments } from '@/hooks/useInstallments'
import { useUser } from '@/hooks/useUser'
import { getTotalMonthlyObligation } from '@/lib/calculations'
import { cn } from '@/lib/utils'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

const inputClass = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
const labelClass = "block text-zinc-400 text-xs mb-1"

type RiskLevel = 'safe' | 'warning' | 'danger'

interface Result {
  risk: RiskLevel
  newMonthly: number
  newTotal: number
  newPercent: number
  oldPercent: number
  message: string
  advice: string
}

export default function Simulator() {
  const { installments } = useInstallments()
  const { profile } = useUser()

  const [price, setPrice] = useState('')
  const [downpayment, setDownpayment] = useState('')
  const [duration, setDuration] = useState('12')
  const [interestRate, setInterestRate] = useState('0')
  const [result, setResult] = useState<Result | null>(null)

  const salary = profile?.monthly_salary ?? 0
  const currentObligations = getTotalMonthlyObligation(installments)

  const simulate = () => {
    const p = parseFloat(price) || 0
    const dp = parseFloat(downpayment) || 0
    const d = parseInt(duration) || 12
    const r = parseFloat(interestRate) || 0

    const principal = p - dp
    const totalRepayment = principal * (1 + r / 100)
    const monthly = totalRepayment / d

    const newTotal = currentObligations + monthly
    const newPercent = salary > 0 ? (newTotal / salary) * 100 : 0
    const oldPercent = salary > 0 ? (currentObligations / salary) * 100 : 0

    let risk: RiskLevel
    let message: string
    let advice: string

    if (salary === 0) {
      risk = 'warning'
      message = 'Salary not set'
      advice = 'Set your monthly salary in Settings to get accurate affordability results.'
    } else if (newPercent >= 60) {
      risk = 'danger'
      message = 'High Risk — Not Recommended'
      advice = `This would bring your salary commitment to ${newPercent.toFixed(1)}%. You'd have very little breathing room for emergencies or savings.`
    } else if (newPercent >= 40) {
      risk = 'warning'
      message = 'Moderate Risk — Proceed with Caution'
      advice = `This would commit ${newPercent.toFixed(1)}% of your salary to installments. Make sure you have an emergency fund before proceeding.`
    } else {
      risk = 'safe'
      message = 'Looks Affordable'
      advice = `Adding this installment would bring your salary commitment to ${newPercent.toFixed(1)}%, which is within a manageable range.`
    }

    setResult({ risk, newMonthly: monthly, newTotal, newPercent, oldPercent, message, advice })
  }

  const riskStyles = {
    safe: {
      bg: 'bg-green-500/10 border-green-500/20',
      text: 'text-green-400',
      icon: ShieldCheck,
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      text: 'text-yellow-400',
      icon: ShieldAlert,
    },
    danger: {
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      icon: ShieldX,
    },
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Can I Afford This?</h2>
          <p className="text-zinc-400 text-sm mt-1">Simulate the impact of a new installment on your finances.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">

          {/* Current state */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-zinc-800">
            <div>
              <p className="text-zinc-500 text-xs">Current Obligations</p>
              <p className="text-white font-semibold mt-0.5">₱{currentObligations.toLocaleString()}/mo</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Monthly Salary</p>
              <p className="text-white font-semibold mt-0.5">
                {salary > 0 ? `₱${salary.toLocaleString()}` : <span className="text-yellow-400 text-xs">Not set</span>}
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Item Price (₱) *</label>
              <input
                type="number"
                className={inputClass}
                placeholder="e.g. 15000"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Downpayment (₱)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={downpayment}
                onChange={e => setDownpayment(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Duration (months)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="12"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Interest Rate (%)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={interestRate}
                onChange={e => setInterestRate(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={simulate}
            disabled={!price}
            className={cn(
              'w-full bg-white text-zinc-950 rounded-lg py-2.5 text-sm font-medium transition-colors',
              !price ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'
            )}
          >
            Simulate
          </button>
        </div>

        {/* Result */}
        {result && (() => {
          const { bg, text, icon: Icon } = riskStyles[result.risk]
          return (
            <div className={cn('mt-4 border rounded-xl p-5', bg)}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className={text} />
                <p className={cn('font-semibold text-sm', text)}>{result.message}</p>
              </div>

              <p className="text-zinc-300 text-sm mb-4">{result.advice}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-zinc-500 text-xs">New Monthly Payment</p>
                  <p className="text-white font-semibold mt-0.5">₱{result.newMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">New Total Obligations</p>
                  <p className="text-white font-semibold mt-0.5">₱{result.newTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Before</p>
                  <p className="text-white font-semibold mt-0.5">{result.oldPercent.toFixed(1)}% of salary</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">After</p>
                  <p className={cn('font-semibold mt-0.5', text)}>{result.newPercent.toFixed(1)}% of salary</p>
                </div>
              </div>

              {/* Before/after bar */}
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Before</span>
                    <span>{result.oldPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${Math.min(result.oldPercent, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>After</span>
                    <span>{result.newPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', result.risk === 'safe' ? 'bg-green-500' : result.risk === 'warning' ? 'bg-yellow-500' : 'bg-red-500')}
                      style={{ width: `${Math.min(result.newPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </AppLayout>
  )
}