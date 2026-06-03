import { useState } from 'react'
import { Plus } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import InstallmentCard from '@/components/installments/InstallmentCard'
import InstallmentForm from '@/components/installments/InstallmentForm'
import { useInstallments } from '@/hooks/useInstallments'

export default function Tracker() {
  const { installments, loading, add, update, remove } = useInstallments()
  const [adding, setAdding] = useState(false)

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Installment Tracker</h2>
            <p className="text-zinc-400 text-sm mt-1">{installments.length} active installment{installments.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {adding && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
            <h3 className="text-white font-medium mb-4">New Installment</h3>
            <InstallmentForm
              onSubmit={async (data) => {
                const err = await add(data)
                if (!err) setAdding(false)
                return err
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : installments.length === 0 && !adding ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">No installments yet.</p>
            <button onClick={() => setAdding(true)} className="mt-3 text-white text-sm underline">Add your first one</button>
          </div>
        ) : (
          <div className="space-y-4">
            {installments.map(i => (
              <InstallmentCard
                key={i.id}
                installment={i}
                onUpdate={update}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}