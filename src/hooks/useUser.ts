import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types'

export function useUser() {
    const { user } = useAuth() 
    const [profile, setProfile] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetch = async() => {
        
    }
}

