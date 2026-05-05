'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [bookings, setBookings] = useState<any[]>([])
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')
  const [mainTab, setMainTab] = useState('bookings')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('bookings')
      .select('*, profiles(full_name, phone), classes(title, start_time, spaces(name))')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false) })
    supabase.from('rentals')
      .select('*, profiles(full_name, phone), spaces(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRentals(data || []))
  }, [])

  const sendEmail = async (type: string, to: string, name: string, title: string, date: string, space: string) => {
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, name, className: title, date, space })
    })
  }

  const handleBookingStatus = async (id: string, status: string, b: any) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(prev => prev.map(x => x.id === id ? { ...x, status } : x))
    showToast(zh ? '状态已更新' : 'Status updated')
  }

  const handleRentalStatus = async (id: string, status: string, r: any) => {
    await supabase.from('rentals').update({ status }).eq('id', id)
    setRentals(prev => prev.map(x => x.id === id ? { ...x, status } : x))
    const start = r.start_time ? new Date(r.start_time) : null
    const dateStr = start ? start.toLocaleDateString() + ' ' + start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    await sendEmail(
      status === 'confirmed' ? 'rental_confirmed' : 'booking_cancelled',
      r.profiles?.email || '',
      r.profiles?.full_name || '',
      '',
      dateStr,
      r.spaces?.name || ''
    )
    showToast(zh ? '已更新并发送通知邮件' : 'Updated and notification sent')
  }

  const handleDeleteBooking = async (id: string) => {
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
    showToast(zh ? '预约已删除' : 'Booking deleted')
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)

  const statusColor: Record<string, { bg: string, text: string }> = {
    confirmed: { bg: '#E8F2EA', text: '#3D7A4E' },
    cancelled:  { bg: '#FAEBE9', text: '#C0544A' },
    waitlist:   { bg: '#FDF3E0', text: '#8A6020' },
    pending:    { bg: '#FDF3E0', text: '#8A6020' },
  }
  const statusLabel = (s: string) => ({
    confirmed: zh ? '已确认' : 'Confirmed',
    cancelled: zh ? '已取消' : 'Cancelled',
    waitlist:  zh ? '候补' : 'Waitlist',
    pending:   zh ? '待审批' : 'Pending',
  }[s] || s)

  const tabs = [['all', zh ? '全部' : 'All'], ['confirmed', zh ? '已确认' : 'Confirmed'], ['waitlist', zh ? '候补' : 'Waitlist'], ['cancelled', zh ? '已取消' : 'Cancelled']]

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '预约管理' : 'Bookings'}</h1>
      </div>

      {/* 主标签：课程预约 vs 场地租用 */}
      <div style={{ display: 'flex', gap: 2, background: '#F2EDE4', borderRadius: 10, padding: 3, marginBottom: 20, width: 'fit-content' }}>
        {[['bookings', zh ? '课程预约' : 'Class Bookings'], ['rentals', zh ? '场地租用' : 'Space Rentals']].map(([key, label]) => (
          <div key={key} onClick={() => setMainTab(key)}
            style={{ padding: '7px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: mainTab === key ? '#fff' : 'transparent', color: mainTab === key ? '#3D2B1F' : '#8B6F52', fontWeight: mainTab === key ? 500 : 400 }}>
            {label} {key === 'rentals' && rentals.filter(r => r.status === 'pending').length > 0 && (
              <span style={{ background: '#C0544A', color: '#fff', borderRadius: 20, fontSize: 10, padding: '1px 6px', marginLeft: 4 }}>
                {rentals.filter(r => r.status === 'pending').length}
              </span>
            )}
          </div>
        ))}
      </div>

      {mainTab === 'bookings' ? (
        <>
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
                {[zh ? '客户' : 'Client', zh ? '课程' : 'Class', zh ? '时间' : 'Time', zh ? '状态' : 'Status', zh ? '操作' : 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C9B89E', fontWeight: 500 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '暂无记录' : 'No bookings found'}</td></tr>
                ) : filtered.map(b => {
                  const sc = statusColor[b.status] || { bg: '#F2EDE4', text: '#8B6F52' }
                  const classTime = b.classes?.start_time ? new Date(b.classes.start_time) : null
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F2EDE4' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 500, color: '#3D2B1F' }}>{b.profiles?.full_name || '—'}</div>
                        <div style={{ fontSize: 11, color: '#C9B89E' }}>{b.profiles?.phone || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>{b.classes?.title || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#8B6F52' }}>
                        {classTime ? `${classTime.toLocaleDateString()} ${classTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.text, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{statusLabel(b.status)}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {b.status !== 'confirmed' && <button onClick={() => handleBookingStatus(b.id, 'confirmed', b)} style={{ background: '#E8F2EA', color: '#3D7A4E', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>{zh ? '确认' : 'Confirm'}</button>}
                          {b.status !== 'cancelled' && <button onClick={() => handleBookingStatus(b.id, 'cancelled', b)} style={{ background: '#FAEBE9', color: '#C0544A', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>{zh ? '取消' : 'Cancel'}</button>}
                          <button onClick={() => handleDeleteBooking(b.id)} style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer', color: '#8B6F52' }}>{zh ? '删除' : 'Delete'}</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #E8DDD0' }}>
              {[zh ? '客户' : 'Client', zh ? '场地' : 'Space', zh ? '时间' : 'Time', zh ? '时长' : 'Duration', zh ? '总价' : 'Total', zh ? '状态' : 'Status', zh ? '操作' : 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C9B89E', fontWeight: 500 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rentals.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '暂无场地租用申请' : 'No space rentals'}</td></tr>
              ) : rentals.map(r => {
                const start = new Date(r.start_time)
                const end = new Date(r.end_time)
                const hours = Math.round((end.getTime() - start.getTime()) / 3600000)
                const sc = statusColor[r.status] || { bg: '#F2EDE4', text: '#8B6F52' }
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F2EDE4' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#3D2B1F' }}>{r.profiles?.full_name || '—'}</div>
                      <div style={{ fontSize: 11, color: '#C9B89E' }}>{r.profiles?.phone || '—'}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>{r.spaces?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#8B6F52' }}>{start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>{hours} {zh ? '小时' : 'hr'}</td>
                    <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>${r.total_price}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.text, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{statusLabel(r.status)}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.status === 'pending' && <>
                          <button onClick={() => handleRentalStatus(r.id, 'confirmed', r)} style={{ background: '#E8F2EA', color: '#3D7A4E', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>{zh ? '批准' : 'Approve'}</button>
                          <button onClick={() => handleRentalStatus(r.id, 'cancelled', r)} style={{ background: '#FAEBE9', color: '#C0544A', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>{zh ? '拒绝' : 'Reject'}</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
