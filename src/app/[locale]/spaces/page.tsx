'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SpacesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [spaces, setSpaces] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ name: '', description: '', capacity: 10, hourly_rate: 50 })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('spaces').select('*').order('created_at').then(({ data }) => setSpaces(data || []))
  }, [])

  const handleCreate = async () => {
    if (!form.name) return showToast(zh ? '请填写场地名称' : 'Please enter space name')
    const { error } = await supabase.from('spaces').insert({ ...form, is_active: true })
    if (error) return showToast(zh ? '创建失败' : 'Failed to create')
    const { data } = await supabase.from('spaces').select('*').order('created_at')
    setSpaces(data || [])
    setShowModal(false)
    setForm({ name: '', description: '', capacity: 10, hourly_rate: 50 })
    showToast(zh ? '场地已创建！' : 'Space created!')
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    await supabase.from('spaces').update({ is_active: !is_active }).eq('id', id)
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, is_active: !is_active } : s))
    showToast(is_active ? (zh ? '场地已停用' : 'Space deactivated') : (zh ? '场地已启用' : 'Space activated'))
  }

  const handleDelete = async (id: string) => {
    await supabase.from('spaces').delete().eq('id', id)
    setSpaces(prev => prev.filter(s => s.id !== id))
    showToast(zh ? '场地已删除' : 'Space deleted')
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '场地管理' : 'Spaces'}</h1>
          <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? `共 ${spaces.length} 个场地` : `${spaces.length} spaces`}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#3D2B1F', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          {zh ? '+ 添加场地' : '+ Add Space'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {spaces.length === 0 ? (
          <div style={{ color: '#8B6F52', padding: 32 }}>{zh ? '暂无场地' : 'No spaces yet'}</div>
        ) : spaces.map(s => (
          <div key={s.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 20, opacity: s.is_active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F' }}>{s.name}</div>
              <span style={{ background: s.is_active ? '#E8F2EA' : '#F2EDE4', color: s.is_active ? '#3D7A4E' : '#8B6F52', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                {s.is_active ? (zh ? '启用' : 'Active') : (zh ? '停用' : 'Inactive')}
              </span>
            </div>
            <p style={{ color: '#8B6F52', fontSize: 13, margin: '0 0 12px' }}>{s.description || (zh ? '暂无描述' : 'No description')}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#3D2B1F', marginBottom: 16 }}>
              <div>👥 {s.capacity} {zh ? '人' : 'people'}</div>
              <div>💰 ${s.hourly_rate}/{zh ? '小时' : 'hr'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleToggle(s.id, s.is_active)}
                style={{ flex: 1, background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#3D2B1F' }}>
                {s.is_active ? (zh ? '停用' : 'Deactivate') : (zh ? '启用' : 'Activate')}
              </button>
              <button onClick={() => handleDelete(s.id)}
                style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#C0544A' }}>
                {zh ? '删除' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(42,35,32,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw', boxShadow: '0 4px 32px rgba(61,43,31,.12)' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3D2B1F', marginBottom: 16 }}>{zh ? '添加场地' : 'Add Space'}</div>
            {[
              { label: zh ? '场地名称' : 'Space Name', key: 'name', type: 'text', placeholder: zh ? '如：Studio A' : 'e.g. Studio A' },
              { label: zh ? '描述' : 'Description', key: 'description', type: 'text', placeholder: zh ? '简短描述' : 'Brief description' },
              { label: zh ? '容纳人数' : 'Capacity', key: 'capacity', type: 'number' },
              { label: zh ? '每小时价格 ($)' : 'Hourly Rate ($)', key: 'hourly_rate', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #E8DDD0' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid #E8DDD0', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '取消' : 'Cancel'}</button>
              <button onClick={handleCreate} style={{ background: '#3D2B1F', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>{zh ? '创建' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
