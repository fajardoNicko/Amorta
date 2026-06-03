import { useState } from 'react'
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
import { getRemainingMonths, getRemainingBalance, getTotalRepayment } from '@/lib/calculations'
import type { Installment } from '@/types'
import InstallmentForm from './InstallmentForm'

interface Props {
  installment: Installment
  onUpdate: (id: string, data: Partial<Installment>) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

export default function InstallmentCard({ installment: i, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)

  const remaining = getRemainingMonths(i)
  const balance = getRemainingBalance(i)
  const total = getTotalRepayment(i)
  const progress = Math.round(((i.duration_months - remaining) / i.duration_months) * 100)

  if (editing) return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-white font-medium mb-4">Edit Installment</h3>
      <InstallmentForm
        initial={i}
        onSubmit={async (data) => {
          const err = await onUpdate(i.id, data)
          if (!err) setEditing(false)
          return err
        }}
        onCancel={() => setEditing(false)}
      />
    </div>
  )

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-medium truncate">{i.name}</h3>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{i.platform}</span>
          </div>
          <p className="text-zinc-400 text-sm mt-0.5">
            ₱{i.monthly_payment.toLocaleString()}/mo · {remaining} months left
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(i.id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
          <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>{progress}% paid</span>
          <span>₱{balance.toLocaleString()} remaining</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Repayment', value: `₱${total.toLocaleString()}` },
            { label: 'Downpayment', value: `₱${i.downpayment.toLocaleString()}` },
            { label: 'Interest Rate', value: `${i.interest_rate}%` },
            { label: 'Due Date', value: `Every ${i.due_date}${['st','nd','rd'][i.due_date-1] ?? 'th'}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-zinc-500 text-xs">{label}</p>
              <p className="text-white text-sm font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}