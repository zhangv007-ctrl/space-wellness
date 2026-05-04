'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('bookings')
      .select('*, profiles(full_name, phone), classes(title, start_time, spaces(name))')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
  }, [])

  const handleStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    showToast(zh ? '状态已更新' : 'Status updated')
  }

  const handleDelete = async (id: string) => {
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
    showToast(zh ? '预约已删除' : 'Booking deleted')
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)

  const statusColor: Record<string, { bg: string, text: string }> = {
    confirmed: { bg: '#E8F2EA', text: '#3D7A4E' },
    cancelled: { bg: '#FAEBE9', text: '#C0544A' },
    waitlist:  { bg: '#FDF3E0', text: '#8A6020' },
  }
  const statusLabel = (s: string) => ({ confirmed: zh ? '已确认' : 'Confirmed', cancelled: zh ? '已取消' : 'Cancelled', waitlist: zh ? '候补' : 'Waitlist' }[s] || s)

  const tabs = [['all', zh ? '全部' : 'All'], ['confirmed', zh ? '已确认' : 'Confirmed'], ['waitlist', zh ? '候补' : 'Waitlist'], ['cancelled', zh ? '已取消' : 'Cancelled']]

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '预约管理' : 'Bookings'}</h1>
        <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? `共 ${bookings.length} 条预约记录` : `${bookings.length} total bookings`}</p>
      </div>

      <div style={{ display: 'flex', gap: 2, background: '#F2EDE4', borderRadius: 10, padding: 3, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(([key, label]) => (
          <div key={key} onClick={() => setFilter(key)}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: filter === key ? '#fff' : 'transparent', color: filter === key ? '#3D2B1F' : '#8B6F52', fontWeight: filter === key ? 500 : 400 }}>
            {label}
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid #E8DDD0' }}>
            {[zh ? '客户' : 'Client', zh ? '课程' : 'Class', zh ? '时间' : 'Time', zh ? '场地' : 'Space', zh ? '状态' : 'Status', zh ? '操作' : 'Actions'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C9B89E', fontWeight: 500 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '暂无预约记录' : 'No bookings found'}</td></tr>
            ) : filtered.map(b => {
              const sc = statusColor[b.status] || { bg: '#F2EDE4', text: '#8B6F52' }
              const classTime = b.classes?.start_time ? new Date(b.classes.start_time) : null
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #F2EDE4' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#3D2B1F' }}>{b.profiles?.full_name || (zh ? '未知用户' : 'Unknown')}</div>
                    <div style={{ fontSize: 11, color: '#C9B89E' }}>{b.profiles?.phone || '—'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>{b.classes?.title || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#8B6F52' }}>
                    {classTime ? `${classTime.toLocaleDateString()} ${classTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8B6F52' }}>{b.classes?.spaces?.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: sc.bg, color: sc.text, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {statusLabel(b.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {b.status !== 'confirmed' && (
                        <button onClick={() => handleStatus(b.id, 'confirmed')}
                          style={{ background: '#E8F2EA', color: '#3D7A4E', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>
                          {zh ? '确认' : 'Confirm'}
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button onClick={() => handleStatus(b.id, 'cancelled')}
                          style={{ background: '#FAEBE9', color: '#C0544A', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>
                          {zh ? '取消' : 'Cancel'}
                        </button>
                      )}
                      <button onClick={() => handleDelete(b.id)}
                        style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', color: '#8B6F52' }}>
                        {zh ? '删除' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
