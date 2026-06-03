import type { Installment } from '@/types'

export function getTotalRepayment(i: Installment) {
    return i.downpayment + i.monthly_payment * i.duration_months
}

export function getRemainingMonths(i: Installment) {
    const start = new Date(i.start_date)
    const now = new Date()
    const elapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    return Math.max(i.duration_months - elapsed)
}

export function getRemainingBalance(i: Installment) {
    return getRemainingMonths(i) * i.monthly_payment
}

export function getEffectiveInterestRate(i: Installment) {
    const totalRepayment = getTotalRepayment(i)
    const principal = totalRepayment / (1 + i.interest_rate / 100)
    const totalInterest = totalRepayment - principal
    return principal > 0 ? (totalInterest / principal) * 100 : 0
}

export function getTotalMonthlyObligation(installments: Installment[]) {
    return installments.reduce((sum, i) => sum + i.monthly_payment, 0)
}

export function getSalaryCommitPercent(installments: Installment[], salary:number) {
    if (salary <= 0) return 0
    return (getTotalMonthlyObligation(installments) / salary) * 100
}

export function getHealthScore(installments: Installment[], salary: number) {
    if (salary <= 0) return 100
    const ratio = getSalaryCommitPercent(installments, salary)
    if (ratio >= 80) return 20
    if (ratio >= 60) return 40
    if (ratio >= 40) return 60
    if (ratio >= 20) return 80
    return 100
}