import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types'

export function useUser() {
    const { user } = useAuth() 
    const [profile, setProfile] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetch = async() => {
        if (!user) return
        setLoading(true)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
        setLoading(false)
    }

    useEffect(() => { fetch() }, [user])

    const update = async (payload: Partial<User>) => {
        if (!user) return
        const { error } = await supabase.from('profiles').update(payload).eq('id', user.id)
        if (!error) await fetch()
        return error
    }

    return { profile, loading, update, refresh: fetch }
}

