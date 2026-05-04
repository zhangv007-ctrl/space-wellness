'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MySchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('upcoming')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('bookings')
        .select('*, classes(title, start_time, end_time, price, spaces(name))')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleCancel = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    showToast(zh ? '预约已取消' : 'Booking cancelled')
  }

  const now = new Date()
  const filtered = bookings.filter(b => {
    const t = b.classes?.start_time ? new Date(b.classes.start_time) : null
    if (tab === 'upcoming') return t && t >= now && b.status === 'confirmed'
    if (tab === 'past') return t && t < now
    if (tab === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const tabs = [['upcoming', zh ? '即将开始' : 'Upcoming'], ['past', zh ? '历史' : 'Past'], ['cancelled', zh ? '已取消' : 'Cancelled']]

  const statusColor: Record<string, { bg: string, text: string }> = {
    confirmed: { bg: '#E8F2EA', text: '#3D7A4E' },
    cancelled: { bg: '#FAEBE9', text: '#C0544A' },
    waitlist: { bg: '#FDF3E0', text: '#8A6020' },
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '我的课表' : 'My Schedule'}</h1>
        <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? '查看和管理你的课程预约' : 'View and manage your class bookings'}</p>
      </div>

      <div style={{ display: 'flex', gap: 2, background: '#F2EDE4', borderRadius: 10, padding: 3, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(([key, label]) => (
          <div key={key} onClick={() => setTab(key)}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: tab === key ? '#fff' : 'transparent', color: tab === key ? '#3D2B1F' : '#8B6F52', fontWeight: tab === key ? 500 : 400 }}>
            {label}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#8B6F52', background: '#fff', borderRadius: 12, border: '1px solid #E8DDD0' }}>
          {zh ? '暂无记录' : 'No bookings here'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => {
            const start = b.classes?.start_time ? new Date(b.classes.start_time) : null
            const end = b.classes?.end_time ? new Date(b.classes.end_time) : null
            const sc = statusColor[b.status] || { bg: '#F2EDE4', text: '#8B6F52' }
            const isPast = start && start < now
            return (
              <div key={b.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ background: '#F2EDE4', borderRadius: 10, padding: '10px 14px', textAlign: 'center', minWidth: 52 }}>
                    <div style={{ fontSize: 20, fontFamily: 'Georgia,serif', color: '#3D2B1F', lineHeight: 1 }}>{start ? start.getDate() : '—'}</div>
                    <div style={{ fontSize: 10, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {start ? start.toLocaleString(zh ? 'zh-CN' : 'en-US', { month: 'short' }) : ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: '#3D2B1F', fontSize: 15 }}>{b.classes?.title || '—'}</div>
                    <div style={{ fontSize: 12, color: '#8B6F52', marginTop: 3 }}>
                      {start && end ? `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '—'}
                      {b.classes?.spaces?.name ? ` · ${b.classes.spaces.name}` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: '#8B6F52', marginTop: 2 }}>${b.classes?.price || 0}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ background: sc.bg, color: sc.text, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                    {{ confirmed: zh ? '已确认' : 'Confirmed', cancelled: zh ? '已取消' : 'Cancelled', waitlist: zh ? '候补' : 'Waitlist' }[b.status] || b.status}
                  </span>
                  {b.status === 'confirmed' && !isPast && (
                    <button onClick={() => handleCancel(b.id)}
                      style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', color: '#C0544A' }}>
                      {zh ? '取消预约' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
