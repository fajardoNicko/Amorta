import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts' 
import { getRemainingMonths } from '@/lib/calculations'
import type { Installment } from '@/types'

interface Props {
    installments: Installment[]
}

function getMonthLabel(offset: number) {
    const d = new Date()
    d.setMonth(d.getMonth() + offset)
    return d.toLocaleString('default', { month: 'short', year: '2-digit'})
}

export default function OverlapChart({ installments }: Props) {
    const months = Array.from({ length: 12 }, (_, i) => {
        const label = getMonthLabel(i)
        const total = installments.reduce((sum, inst) => {
            const remaining = getRemainingMonths(inst)
            return i < remaining ? sum + inst.monthly_payment : sum
        }, 0)
        return { label, total } 
    })

    const max = Math.max(...months.map(m => m.total))

    const getColor = (total: number) => { 
        if (max === 0) return '#3f3f46' //gray of no installmentss
        const ratio = total / max
        if (ratio >= 0.8) return '#ef4444' //red if 80% or more 
        if (ratio >= 0.5) return '#eab308' //yellow if 50% or more
        return '#22c55e' //green otherwise
    }

    return (
        <>
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-white font-medium text-sm mb-1">12-Month Obligation Overview</p>
      <p className="text-zinc-500 text-xs mb-5">Monthly payment load for the next 12 months</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={months} barSize={28}>
          <XAxis
            dataKey="label"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₱${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 8 }}
            labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
            itemStyle={{ color: '#fff', fontSize: 12 }}
            formatter={(v: any) => [v !== undefined && v !== null ? `₱${v.toLocaleString()}` : '₱0', 'Obligations']}

          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {months.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.total)} />
            ))}
            </Bar>
            </BarChart>
      </ResponsiveContainer>
    </div>
        </>
    )
}