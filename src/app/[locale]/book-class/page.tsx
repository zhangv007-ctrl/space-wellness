'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookClassPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('classes')
      .select('*, spaces(name), bookings(id, status)')
      .order('start_time')
      .then(({ data }) => setClasses(data || []))
  }, [])

  const handleBook = async (cls: any) => {
    const { error } = await supabase.from('bookings').insert({
      class_id: cls.id,
      profile_id: '00000000-0000-0000-0000-000000000000', // replace with current user id
      status: cls.available_spots > 0 ? 'confirmed' : 'waitlist',
      created_at: new Date().toISOString(),
    })
    if (error) return showToast(zh ? '预约失败' : 'Booking failed')
    setSelected(null)
    showToast(zh ? '预约成功！' : 'Booked successfully!')
  }

  const filtered = classes.filter((cls) => {
    if (filter === 'all') return true
    if (filter === 'beginner') return cls.level === 'beginner'
    if (filter === 'intermediate') return cls.level === 'intermediate'
    if (filter === 'advanced') return cls.level === 'advanced'
    return true
  })

  const classStatus = (cls: any) => {
    if (cls.available_spots === 0) return { label: zh ? '已满' : 'Full', color: '#C0544A' }
    if (cls.bookings?.length > 0) return { label: zh ? '有预约' : 'Booked', color: '#7A9E87' }
    return { label: zh ? '可预约' : 'Open', color: '#3D7A4E' }
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '预约课程' : 'Book a Class'}</h1>
        <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? '选择课程并预约名额' : 'Select a class and reserve your spot'}</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2' }}>
          <option value="all">{zh ? '全部程度' : 'All levels'}</option>
          <option value="beginner">{zh ? '初级' : 'Beginner'}</option>
          <option value="intermediate">{zh ? '中级' : 'Intermediate'}</option>
          <option value="advanced">{zh ? '高级' : 'Advanced'}</option>
        </select>
        <select style={{ padding: '8px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2' }}>
          <option>{zh ? '全部教师' : 'Any teacher'}</option>
          <option>Emma K.</option>
          <option>Lisa M.</option>
          <option>Mark T.</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((cls) => {
          const status = classStatus(cls)
          return (
            <div key={cls.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F' }}>{zh ? cls.name_zh || cls.name : cls.name}</div>
                <span style={{ background: '#F2EDE4', color: status.color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{status.label}</span>
              </div>
              <div style={{ fontSize: 12, color: '#8B6F52', marginBottom: 12 }}>{new Date(cls.start_time).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: 13, color: '#8B6F52', marginBottom: 12 }}>{cls.spaces?.name || '—'} · {cls.instructor || cls.teacher || '—'}</div>
              <div style={{ fontSize: 12, color: '#8B6F52', marginBottom: 16 }}>{zh ? cls.level_zh || cls.level : cls.level}</div>
              <button onClick={() => setSelected(cls)} disabled={cls.available_spots === 0} style={{ width: '100%', background: cls.available_spots === 0 ? '#F2EDE4' : '#3D2B1F', color: cls.available_spots === 0 ? '#8B6F52' : '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, cursor: cls.available_spots === 0 ? 'not-allowed' : 'pointer' }}>
                {cls.available_spots === 0 ? (zh ? '查看候补' : 'View waitlist') : (zh ? '预约课程' : 'Book Class')}
              </button>
            </div>
          )
        })}
      </div>

      {selected && (
        <div onClick={(e) => e.target === e.currentTarget && setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(42,35,32,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw', boxShadow: '0 4px 32px rgba(61,43,31,.12)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3D2B1F', marginBottom: 4 }}>{zh ? '确认预约' : 'Confirm Booking'}</div>
            <div style={{ fontSize: 12, color: '#8B6F52', marginBottom: 20 }}>{zh ? '确认前请核查以下信息' : 'Review your selection before confirming'}</div>
            <div style={{ background: '#FAF7F2', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#3D2B1F', marginBottom: 4 }}>{zh ? selected.name_zh || selected.name : selected.name}</div>
              <div style={{ fontSize: 13, color: '#8B6F52' }}>{new Date(selected.start_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: 13, color: '#8B6F52' }}>{selected.spaces?.name || '—'} · {selected.instructor || selected.teacher || '—'}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase' as const, letterSpacing: '.04em', marginBottom: 6 }}>{zh ? '通知方式' : 'Notification preference'}</div>
              <select style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2' }}>
                <option>{zh ? '邮件确认' : 'Email confirmation'}</option>
                <option>{zh ? '短信确认' : 'SMS confirmation'}</option>
                <option>{zh ? '两者都要' : 'Both'}</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #E8DDD0' }}>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '取消' : 'Cancel'}</button>
              <button onClick={() => handleBook(selected)} style={{ background: '#3D2B1F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '确认预约' : 'Confirm Booking'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(8px)', transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
