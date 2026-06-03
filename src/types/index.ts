export interface Installment { 
    id: string
    user_id: string
    name: string
    platform: string
    downpayment: number
    monthly_payment: number
    duration_months: number
    interest_rate: number
    due_date: number
    start_date: string
    is_active: boolean
    created_at: string
}

export interface User {
    id: string
    full_name: string
    monthly_salary: number
    currency: string
    created_at: string
}