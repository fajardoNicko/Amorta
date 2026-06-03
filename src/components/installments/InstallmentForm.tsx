import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Installment } from '@/types'

const PLATFORMS = ['Home Credit', 'BillEase', 'Akulaku', 'GGives', 'Atome', 'SPaylater', 'Credit Card', 'Other']

interface Props {
  initial?: Partial<Installment>
  onSubmit: (data: Omit<Installment, 'id' | 'user_id' | 'created_at'>) => Promise<unknown>
  onCancel: () => void
}

const inputClass = "w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
const labelClass = "block text-zinc-400 text-xs mb-1"

export default function InstallmentForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    platform: initial?.platform ?? 'Other',
    downpayment: initial?.downpayment ?? 0,
    monthly_payment: initial?.monthly_payment ?? 0,
    duration_months: initial?.duration_months ?? 12,
    interest_rate: initial?.interest_rate ?? 0,
    due_date: initial?.due_date ?? 1,
    start_date: initial?.start_date ?? new Date().toISOString().split('T')[0],
    is_active: initial?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    if (!form.name || !form.monthly_payment || !form.duration_months) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    const err = await onSubmit(form)
    if (err) setError('Something went wrong. Try again.')
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product / Item name *</label>
          <input className={inputClass} placeholder="e.g. iPhone 15" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Platform</label>
          <select className={inputClass} value={form.platform} onChange={e => set('platform', e.target.value)}>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Monthly Payment (₱) *</label>
          <input type="number" className={inputClass} placeholder="0" value={form.monthly_payment} onChange={e => set('monthly_payment', +e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Duration (months) *</label>
          <input type="number" className={inputClass} placeholder="12" value={form.duration_months} onChange={e => set('duration_months', +e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Downpayment (₱)</label>
          <input type="number" className={inputClass} placeholder="0" value={form.downpayment} onChange={e => set('downpayment', +e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Interest Rate (%)</label>
          <input type="number" className={inputClass} placeholder="0" value={form.interest_rate} onChange={e => set('interest_rate', +e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Due Date (day of month)</label>
          <input type="number" min={1} max={31} className={inputClass} placeholder="1" value={form.due_date} onChange={e => set('due_date', +e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" className={inputClass} value={form.start_date} onChange={e => set('start_date', e.target.value)} />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            'flex-1 bg-white text-zinc-950 rounded-lg py-2.5 text-sm font-medium transition-colors',
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'
          )}
        >
          {loading ? 'Saving...' : 'Save Installment'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-zinc-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}