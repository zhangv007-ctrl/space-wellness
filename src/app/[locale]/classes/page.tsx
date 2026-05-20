'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ClassesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [spaces, setSpaces] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({ title: '', date: '', start_time: '', space_id: '', capacity: 10, price: 0 })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('classes').select('*, spaces(name)').order('start_time').then(({ data }) => setClasses(data || []))
    supabase.from('spaces').select('*').then(({ data }) => setSpaces(data || []))
  }, [])

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.start_time) return showToast(zh ? '请填写所有必填项' : 'Please fill all required fields')
    const start = new Date(`${form.date}T${form.start_time}`)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const { error } = await supabase.from('classes').insert({
      title: form.title, space_id: form.space_id || spaces[0]?.id,
      start_time: start.toISOString(), end_time: end.toISOString(),
      capacity: form.capacity, price: form.price, is_active: true
    })
    if (error) return showToast(zh ? '创建失败' : 'Failed to create')
    const { data } = await supabase.from('classes').select('*, spaces(name)').order('start_time')
    setClasses(data || [])
    setShowModal(false)
    showToast(zh ? '课程已创建！' : 'Class created!')
  }

  const handleDelete = async (id: string) => {
    await supabase.from('classes').delete().eq('id', id)
    setClasses(prev => prev.filter(c => c.id !== id))
    showToast(zh ? '课程已删除' : 'Class deleted')
  }

  const now = new Date()
  const filtered = classes.filter(c => {
    const t = new Date(c.start_time)
    if (tab === 'upcoming') return t >= now
    if (tab === 'past') return t < now
    return true
  })

  const tabs = [['all', zh ? '全部' : 'All'], ['upcoming', zh ? '即将开始' : 'Upcoming'], ['past', zh ? '历史' : 'Past']]

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#3D2B1F', margin: 0 }}>{zh ? '课程管理' : 'Classes'}</h1>
          <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? `共 ${classes.length} 节课程` : `${classes.length} total classes`}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#3D2B1F', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>{zh ? '+ 创建课程' : '+ Create Class'}</button>
      </div>

      <div style={{ display: 'flex', gap: 2, background: '#F2EDE4', borderRadius: 10, padding: 3, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(([key, label]) => (
          <div key={key} onClick={() => setTab(key)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: tab === key ? '#fff' : 'transparent', color: tab === key ? '#3D2B1F' : '#8B6F52', fontWeight: tab === key ? 500 : 400 }}>{label}</div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#8B6F52' }}>{zh ? '暂无课程' : 'No classes found'}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((c) => {
            const start = new Date(c.start_time)
            const isPast = start < now
            return (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#3D2B1F', fontSize: 15, marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#C9B89E' }}>${c.price}</div>
                  </div>
                  {isPast
                    ? <span style={{ background: '#F2EDE4', color: '#8B6F52', padding: '3px 10px', borderRadius: 20, fontSize: 11, flexShrink: 0 }}>{zh ? '已结束' : 'Past'}</span>
                    : <span style={{ background: '#E8F2EA', color: '#3D7A4E', padding: '3px 10px', borderRadius: 20, fontSize: 11, flexShrink: 0 }}>{zh ? '开放' : 'Open'}</span>
                  }
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#C9B89E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{zh ? '时间' : 'Time'}</div>
                    <div style={{ fontSize: 13, color: '#3D2B1F' }}>{start.toLocaleDateString()}</div>
                    <div style={{ fontSize: 12, color: '#8B6F52' }}>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#C9B89E', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{zh ? '场地 / 名额' : 'Space / Cap'}</div>
                    <div style={{ fontSize: 13, color: '#3D2B1F' }}>{c.spaces?.name || '—'}</div>
                    <div style={{ fontSize: 12, color: '#8B6F52' }}>{c.capacity} {zh ? '人' : 'people'}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.id)} style={{ width: '100%', background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '8px', fontSize: 13, cursor: 'pointer', color: '#C0544A' }}>{zh ? '删除课程' : 'Delete Class'}</button>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(42,35,32,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, maxWidth: '92vw', boxShadow: '0 4px 32px rgba(61,43,31,.12)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3D2B1F', marginBottom: 16 }}>{zh ? '创建课程' : 'Create Class'}</div>
            {[
              { label: zh ? '课程名称' : 'Class Name', key: 'title', type: 'text', placeholder: zh ? '如：晨间流动' : 'e.g. Morning Flow' },
              { label: zh ? '日期' : 'Date', key: 'date', type: 'date' },
              { label: zh ? '开始时间' : 'Start Time', key: 'start_time', type: 'time' },
              { label: zh ? '价格' : 'Price', key: 'price', type: 'number' },
              { label: zh ? '名额上限' : 'Capacity', key: 'capacity', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{zh ? '场地' : 'Space'}</div>
              <select value={form.space_id} onChange={e => setForm(prev => ({ ...prev, space_id: e.target.value }))} style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2' }}>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #E8DDD0' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '取消' : 'Cancel'}</button>
              <button onClick={handleCreate} style={{ background: '#3D2B1F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '创建' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ position: 'fixed', bottom: 80, right: 16, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
