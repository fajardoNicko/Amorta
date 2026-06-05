//import { useState } from 'react'
import { CreditCard, Wallet, BarChart2, Activity } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import SalaryLockBar from '@/components/dashboard/SalaryLockBar'
import OverlapChart from '@/components/dashboard/OverlapChart'
import HealthScore from '@/components/dashboard/HealthScore'
import { useInstallments } from '@/hooks/useInstallments'
import { useUser } from '@/hooks/useUser'
import {
  getTotalMonthlyObligation,
  getSalaryCommitPercent,
  getHealthScore,
} from '@/lib/calculations'

export default function Dashboard() {
  const { installments, loading: loadingInstallments } = useInstallments()
  const { profile, loading: loadingUser } = useUser()

  const salary = profile?.monthly_salary ?? 0
  const obligations = getTotalMonthlyObligation(installments)
  const commitPercent = getSalaryCommitPercent(installments, salary)
  const healthScore = getHealthScore(installments, salary)

  const loading = loadingInstallments || loadingUser

  const intentFromPercent = (p: number) =>
    p >= 60 ? 'danger' : p >= 40 ? 'warning' : 'safe'

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            Hey, {profile?.full_name?.split(' ')[0] ?? 'there'} 
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Here's your financial overview.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(n => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Monthly Obligations"
                value={`₱${obligations.toLocaleString()}`}
                sub="total due this month"
                icon={CreditCard}
                intent={intentFromPercent(commitPercent)}
              />
              <StatCard
                label="Salary Committed"
                value={`${commitPercent.toFixed(1)}%`}
                sub={salary > 0 ? `of ₱${salary.toLocaleString()}` : 'Set salary in settings'}
                icon={Wallet}
                intent={intentFromPercent(commitPercent)}
              />
              <StatCard
                label="Active Installments"
                value={`${installments.length}`}
                sub="currently tracked"
                icon={BarChart2}
              />
              <StatCard
                label="Health Score"
                value={`${healthScore}/100`}
                sub={healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Moderate Risk' : 'High Risk'}
                icon={Activity}
                intent={healthScore >= 80 ? 'safe' : healthScore >= 60 ? 'warning' : 'danger'}
              />
            </div>

            {/* Salary not set warning */}
            {salary === 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 mb-6">
                <p className="text-yellow-400 text-sm">
                  Set your monthly salary in <a href="/settings" className="underline">Settings</a> to unlock salary lock and health score insights.
                </p>
              </div>
            )}

            {/* Health Score + Salary Lock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <HealthScore score={healthScore} />
              <SalaryLockBar
                percent={commitPercent}
                salary={salary}
                obligations={obligations}
              />
            </div>

            {/* Overlap Chart */}
            <OverlapChart installments={installments} />
          </>
        )}
      </div>
    </AppLayout>
  )
}