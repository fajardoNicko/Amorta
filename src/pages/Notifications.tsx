import AppLayout from '@/components/layout/AppLayout'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { Bell, BellOff, Trash2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react'

const typeConfig = {
  reminder: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'Reminder',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    label: 'Warning',
  },
  overcommit: {
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    label: 'Overcommit Alert',
  },
}

export default function Notifications() {
  const { notifications, loading, markRead, markAllRead, remove, unreadCount } = useNotifications()

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-zinc-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs transition-colors"
            >
              <BellOff size={14} />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse h-20" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No notifications yet.</p>
            <p className="text-zinc-600 text-xs mt-1">They'll appear here when payments are due or your debt load is high.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => {
              const { icon: Icon, color, bg, label } = typeConfig[n.type]
              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={cn(
                    'border rounded-xl p-4 cursor-pointer transition-opacity',
                    bg,
                    n.is_read ? 'opacity-50' : 'opacity-100'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Icon size={16} className={cn('mt-0.5 shrink-0', color)} />
                      <div className="min-w-0">
                        <p className={cn('text-xs font-medium mb-0.5', color)}>{label}</p>
                        <p className="text-zinc-300 text-sm">{n.message}</p>
                        <p className="text-zinc-600 text-xs mt-1">
                          {new Date(n.created_at).toLocaleDateString('en-PH', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); remove(n.id) }}
                      className="text-zinc-600 hover:text-red-400 transition-colors shrink-0 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}