import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useInstallments } from './useInstallments'
import { useUser } from './useUser'
import { generateNotifications } from '@/lib/generateNotifications'
import type { NotificationPayload } from '@/lib/generateNotifications'

export interface AppNotification {
  id: string
  user_id: string
  installment_id: string | null
  type: 'reminder' | 'warning' | 'overcommit'
  message: string
  scheduled_at: string
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const { user } = useAuth()
  const { installments } = useInstallments()
  const { profile } = useUser()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setNotifications(data ?? [])
    setLoading(false)
  }

  const sync = async () => {
    if (!user || installments.length === 0) return
    const salary = profile?.monthly_salary ?? 0
    const generated = generateNotifications(installments, user.id, salary)

    // Avoid duplicates — only insert if same message doesn't exist today
    const today = new Date().toISOString().split('T')[0]
    const { data: existing } = await supabase
      .from('notifications')
      .select('message')
      .eq('user_id', user.id)
      .gte('created_at', today)

    const existingMessages = new Set(existing?.map(n => n.message) ?? [])
    const toInsert = generated.filter(n => !existingMessages.has(n.message))

    if (toInsert.length > 0) {
      await supabase.from('notifications').insert(toInsert)
    }
    await fetch()
  }

  useEffect(() => {
    if (installments.length > 0 && profile) sync()
    else fetch()
  }, [user, installments, profile])

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const remove = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return { notifications, loading, markRead, markAllRead, remove, unreadCount }
}