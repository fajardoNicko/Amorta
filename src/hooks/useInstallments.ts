import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Installment } from '@/types'

export function useInstallments() {
    const { user } = useAuth()
    const [installments, setInstallments] = useState<Installment[]>([])
    const [loading, setLoading] = useState(true)

    const fetch = async() => {
        if (!user) return
        setLoading(true)

        const { data } = await supabase.from('installments').select('*').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false })
        setInstallments(data ?? [])
        setLoading(false)
    }

    useEffect(() => { fetch() }, [user])

    const add = async (payload: Omit<Installment, 'id' | 'user_id' | 'created_at'>) => {
        if (!user) return
        const { error } = await supabase.from('installments').insert({ ...payload, user_id: user.id })
        if (!error) await fetch()
        return error
    }

    const update = async (id: string, payload: Partial<Installment>) => {
        const { error } = await supabase.from('installments').update(payload).eq('id', id)
        if (!error) await fetch()
        return error
    }

    const remove = async (id: string) => {
        const { error } = await supabase.from('installments').update({ is_active: false }).eq('id', id)
        if (!error) await fetch()
        return error
    }

    return { installments, loading, add, update, remove }
}