'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RentSpacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [spaces, setSpaces] = useState<any[]>([])
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState({ date: '', start_time: '', hours: 1 })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      const { data: sp } = await supabase.from('spaces').select('*').eq('is_active', true).order('name')
      setSpaces(sp || [])
      if (user) {
        const { data: rt } = await supabase
          .from('rentals')
          .select('*, spaces(name)')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
        setRentals(rt || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleRent = async () => {
    if (!userId) return showToast(zh ? '请先登录' : 'Please sign in')
    if (!form.date || !form.start_time) return showToast(zh ? '请填写日期和时间' : 'Please fill date and time')
    const start = new Date(`${form.date}T${form.start_time}`)
    const end = new Date(start.getTime() + form.hours * 60 * 60 * 1000)
    const total = (selected.hourly_rate || 0) * form.hours
    const { error } = await supabase.from('rentals').insert({
      client_id: userId,
      space_id: selected.id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      total_price: total,
      status: 'pending'
    })
    if (error) return showToast(zh ? '预约失败' : 'Booking failed')

    // 发送确认邮件
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).single()
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'rental_confirmed',
        to: user?.email,
        name: profile?.full_name || user?.email,
        className: '',
        date: start.toLocaleDateString() + ' ' + start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        space: selected.name,
      })
    })

    const { data: rt } = await supabase.from('rentals').select('*, spaces(name)').eq('client_id', userId).order('created_at', { ascending: false })
    setRentals(rt || [])
    setSelected(null)
    setForm({ date: '', start_time: '', hours: 1 })
    showToast(zh ? `已成功预约「${selected.name}」！确认邮件已发送。` : `Booked "${selected.name}"! Confirmation email sent.`)
  }

  const handleCancel = async (id: string) => {
    await supabase.from('rentals').update({ status: 'cancelled' }).eq('id', id)
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    showToast(zh ? '已取消租用' : 'Rental cancelled')
  }

  const statusColor: Record<string, { bg: string, text: string }> = {
    pending:   { bg: '#FDF3E0', text: '#8A6020' },
    confirmed: { bg: '#E8F2EA', text: '#3D7A4E' },
    cancelled: { bg: '#FAEBE9', text: '#C0544A' },
  }
  const statusLabel = (s: string) => ({ pending: zh ? '待确认' : 'Pending', confirmed: zh ? '已确认' : 'Confirmed', cancelled: zh ? '已取消' : 'Cancelled' }[s] || s)

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '租用场地' : 'Rent a Space'}</h1>
        <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? '按小时租用我们的场地' : 'Book our spaces by the hour'}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 36 }}>
            {spaces.map(s => (
              <div key={s.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F', marginBottom: 6 }}>{s.name}</div>
                <p style={{ color: '#8B6F52', fontSize: 13, margin: '0 0 12px' }}>{s.description || (zh ? '暂无描述' : 'No description')}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#3D2B1F', marginBottom: 16 }}>
                  <div>👥 {s.capacity} {zh ? '人' : 'people'}</div>
                  <div>💰 ${s.hourly_rate}/{zh ? '小时' : 'hr'}</div>
                </div>
                <button onClick={() => setSelected(s)}
                  style={{ width: '100%', background: '#3D2B1F', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer' }}>
                  {zh ? '预约此场地' : 'Book This Space'}
                </button>
              </div>
            ))}
          </div>

          {rentals.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#3D2B1F', marginBottom: 14 }}>{zh ? '我的租用记录' : 'My Rentals'}</h2>
              <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr style={{ borderBottom: '1px solid #E8DDD0' }}>
                    {[zh ? '场地' : 'Space', zh ? '时间' : 'Time', zh ? '时长' : 'Duration', zh ? '总价' : 'Total', zh ? '状态' : 'Status', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C9B89E', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {rentals.map(r => {
                      const start = new Date(r.start_time)
                      const end = new Date(r.end_time)
                      const hours = Math.round((end.getTime() - start.getTime()) / 3600000)
                      const sc = statusColor[r.status] || { bg: '#F2EDE4', text: '#8B6F52' }
                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #F2EDE4' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#3D2B1F' }}>{r.spaces?.name}</td>
                          <td style={{ padding: '12px 16px', color: '#8B6F52' }}>
                            {start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>{hours} {zh ? '小时' : 'hr'}</td>
                          <td style={{ padding: '12px 16px', color: '#3D2B1F' }}>${r.total_price}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: sc.bg, color: sc.text, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                              {statusLabel(r.status)}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {r.status === 'pending' && (
                              <button onClick={() => handleCancel(r.id)}
                                style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#C0544A' }}>
                                {zh ? '取消' : 'Cancel'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {selected && (
        <div onClick={e => e.target === e.currentTarget && setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(42,35,32,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw', boxShadow: '0 4px 32px rgba(61,43,31,.12)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3D2B1F', marginBottom: 4 }}>{selected.name}</div>
            <div style={{ fontSize: 13, color: '#8B6F52', marginBottom: 20 }}>${selected.hourly_rate}/{zh ? '小时' : 'hr'} · {selected.capacity} {zh ? '人' : 'people'}</div>
            {[
              { label: zh ? '日期' : 'Date', key: 'date', type: 'date' },
              { label: zh ? '开始时间' : 'Start Time', key: 'start_time', type: 'time' },
              { label: zh ? '租用时长（小时）' : 'Duration (hours)', key: 'hours', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{f.label}</div>
                <input type={f.type} min={f.type === 'number' ? 1 : undefined} value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ background: '#F2EDE4', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#3D2B1F' }}>
              {zh ? '预计费用：' : 'Estimated cost: '}
              <strong>${(selected.hourly_rate * form.hours).toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #E8DDD0' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '取消' : 'Cancel'}</button>
              <button onClick={handleRent} style={{ background: '#3D2B1F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '确认预约' : 'Confirm Booking'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
