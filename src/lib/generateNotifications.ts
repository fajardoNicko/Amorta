import type { Installment } from '@/types'
import { getRemainingMonths, getSalaryCommitPercent } from './calculations'

export interface NotificationPayload {
  user_id: string
  installment_id: string | null
  type: 'reminder' | 'warning' | 'overcommit'
  message: string
  scheduled_at: string
}

export function generateNotifications(
  installments: Installment[],
  userId: string,
  salary: number
): NotificationPayload[] {
  const notifications: NotificationPayload[] = []
  const now = new Date()
  const today = now.getDate()

  for (const inst of installments) {
    const remaining = getRemainingMonths(inst)
    if (remaining <= 0) continue

    // Payment reminder — due within 5 days
    const daysUntilDue = inst.due_date >= today
      ? inst.due_date - today
      : inst.due_date + (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - today)

    if (daysUntilDue <= 5) {
      notifications.push({
        user_id: userId,
        installment_id: inst.id,
        type: 'reminder',
        message: `Payment due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}: ₱${inst.monthly_payment.toLocaleString()} for ${inst.name}.`,
        scheduled_at: new Date().toISOString(),
      })
    }

    // Last month warning
    if (remaining === 1) {
      notifications.push({
        user_id: userId,
        installment_id: inst.id,
        type: 'warning',
        message: `Last payment coming up for ${inst.name}. You're almost done!`,
        scheduled_at: new Date().toISOString(),
      })
    }
  }

  // Overcommitment warning
  const commitPercent = getSalaryCommitPercent(installments, salary)
  if (salary > 0 && commitPercent >= 60) {
    notifications.push({
      user_id: userId,
      installment_id: null,
      type: 'overcommit',
      message: `${commitPercent.toFixed(1)}% of your salary is committed to installments. Consider paying off some debts before adding new ones.`,
      scheduled_at: new Date().toISOString(),
    })
  }

  return notifications
}