'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookClassPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [booked, setBooked] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({})
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      setUserEmail(user?.email || null)
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
        setUserName(profile?.full_name || user.email || null)
      }
      const { data: cls } = await supabase
        .from('classes')
        .select('*, spaces(name)')
        .gte('start_time', new Date().toISOString())
        .eq('is_active', true)
        .order('start_time')
      setClasses(cls || [])
      
      // 获取每节课已确认预约数
      if (cls && cls.length > 0) {
        const counts: Record<string, number> = {}
        await Promise.all(cls.map(async (c: any) => {
          const { count } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', c.id)
            .eq('status', 'confirmed')
          counts[c.id] = count || 0
        }))
        setBookingCounts(counts)
      }
      if (user) {
        const { data: bk } = await supabase
          .from('bookings')
          .select('class_id')
          .eq('client_id', user.id)
          .eq('status', 'confirmed')
        setBooked(new Set((bk || []).map((b: any) => b.class_id)))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleBook = async (cls: any) => {
    if (!userId) return showToast(zh ? '请先登录' : 'Please sign in first')
    if (booked.has(cls.id)) return showToast(zh ? '已预约此课程' : 'Already booked')

    // 检查容量
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', cls.id)
      .eq('status', 'confirmed')
    
    const isFull = (count || 0) >= cls.capacity
    const status = isFull ? 'waitlist' : 'confirmed'

    const { error } = await supabase.from('bookings').insert({
      client_id: userId,
      class_id: cls.id,
      status
    })

    if (error) return showToast(zh ? '预约失败，请重试' : 'Booking failed, please try again')
    setBooked(prev => new Set([...prev, cls.id]))
    setBookingCounts(prev => ({ ...prev, [cls.id]: (prev[cls.id] || 0) + (isFull ? 0 : 1) }))
    
    if (isFull) {
      showToast(zh ? `课程已满，已加入候补名单！` : `Class is full, added to waitlist!`)
      return
    }

    const start = new Date(cls.start_time)
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking_confirmed',
        to: userEmail,
        name: userName,
        className: cls.title,
        date: start.toLocaleDateString() + ' ' + start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        space: cls.spaces?.name || '',
      })
    })

    showToast(zh ? `已成功预约「${cls.title}」！确认邮件已发送。` : `Booked "${cls.title}"! Confirmation email sent.`)
  }

  const groupByDate = (list: any[]) => {
    const groups: Record<string, any[]> = {}
    list.forEach(c => {
      const d = new Date(c.start_time).toLocaleDateString(zh ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      if (!groups[d]) groups[d] = []
      groups[d].push(c)
    })
    return groups
  }

  const grouped = groupByDate(classes)

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#3D2B1F', margin: 0 }}>{zh ? '预约课程' : 'Book a Class'}</h1>
        <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? '浏览并预约即将开始的课程' : 'Browse and book upcoming classes'}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#8B6F52', background: '#fff', borderRadius: 12, border: '1px solid #E8DDD0' }}>
          {zh ? '暂无即将开始的课程' : 'No upcoming classes available'}
        </div>
      ) : Object.entries(grouped).map(([date, list]) => (
        <div key={date} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>{date}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {list.map(cls => {
              const isBooked = booked.has(cls.id)
              const start = new Date(cls.start_time)
              const end = new Date(cls.end_time)
              return (
                <div key={cls.id} style={{ background: '#fff', border: `1px solid ${isBooked ? '#7A9E87' : '#E8DDD0'}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#3D2B1F' }}>{cls.title}</div>
                    {isBooked && <span style={{ background: '#E8F2EA', color: '#3D7A4E', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{zh ? '已预约' : 'Booked'}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#8B6F52', marginBottom: 4 }}>🕐 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: 13, color: '#8B6F52', marginBottom: 4 }}>📍 {cls.spaces?.name || '—'}</div>
                  <div style={{ fontSize: 13, color: '#8B6F52', marginBottom: 4 }}>
                    👥 {zh ? `最多 ${cls.capacity} 人` : `Up to ${cls.capacity} people`}
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 16, color: (bookingCounts[cls.id] || 0) >= cls.capacity ? '#C0544A' : '#3D7A4E', fontWeight: 500 }}>
                    {(bookingCounts[cls.id] || 0) >= cls.capacity 
                      ? (zh ? '⚠️ 已满员 — 可加入候补' : '⚠️ Full — Join Waitlist')
                      : (zh ? `✓ 剩余 ${cls.capacity - (bookingCounts[cls.id] || 0)} 个名额` : `✓ ${cls.capacity - (bookingCounts[cls.id] || 0)} spots left`)
                    }
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F' }}>${cls.price}</div>
                    <button onClick={() => handleBook(cls)} disabled={isBooked}
                      style={{ background: isBooked ? '#F2EDE4' : '#3D2B1F', color: isBooked ? '#8B6F52' : '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: isBooked ? 'default' : 'pointer' }}>
                      {isBooked 
                        ? (zh ? '已预约' : 'Booked') 
                        : (bookingCounts[cls.id] || 0) >= cls.capacity 
                          ? (zh ? '加入候补' : 'Join Waitlist')
                          : (zh ? '立即预约' : 'Book Now')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{ position: 'fixed', bottom: 80, right: 16, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
