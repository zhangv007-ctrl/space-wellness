'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()

  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setClients(data || []); setLoading(false) })
  }, [])

  const filtered = clients.filter(c =>
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  const handleRoleChange = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    setClients(prev => prev.map(c => c.id === id ? { ...c, role } : c))
    showToast(zh ? '角色已更新' : 'Role updated')
  }

  const roleColor: Record<string, string> = { admin: '#C0544A', instructor: '#7A9E87', client: '#B89A5A' }
  const roleLabel = (r: string) => ({ admin: zh ? '管理员' : 'Admin', instructor: zh ? '教师' : 'Instructor', client: zh ? '客户' : 'Client' }[r] || r)

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#3D2B1F', margin: '0 0 4px' }}>{zh ? '客户管理' : 'Clients'}</h1>
        <p style={{ color: '#8B6F52', margin: 0, fontSize: 13 }}>{zh ? `共 ${clients.length} 名用户` : `${clients.length} registered users`}</p>
      </div>

      {/* Search */}
      <input
        placeholder={zh ? '搜索姓名或电话…' : 'Search name or phone…'}
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 14, background: '#FAF7F2', outline: 'none', marginBottom: 16, boxSizing: 'border-box' as const }}
      />

      {/* Client Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#8B6F52' }}>{zh ? '没有找到用户' : 'No users found'}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F2EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#8B6F52', fontWeight: 600, flexShrink: 0 }}>
                    {(c.full_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: '#3D2B1F', fontSize: 15 }}>{c.full_name || (zh ? '未填写' : 'No name')}</div>
                    <div style={{ color: '#8B6F52', fontSize: 12, marginTop: 2 }}>{c.phone || '—'}</div>
                  </div>
                </div>
                <span style={{ background: roleColor[c.role] + '22', color: roleColor[c.role], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                  {roleLabel(c.role || 'client')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#C9B89E' }}>
                  {zh ? '注册：' : 'Joined: '}{new Date(c.created_at).toLocaleDateString()}
                </div>
                <select value={c.role || 'client'} onChange={e => handleRoleChange(c.id, e.target.value)}
                  style={{ padding: '6px 10px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 12, background: '#FAF7F2', cursor: 'pointer' }}>
                  <option value="client">{zh ? '客户' : 'Client'}</option>
                  <option value="instructor">{zh ? '教师' : 'Instructor'}</option>
                  <option value="admin">{zh ? '管理员' : 'Admin'}</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 80, right: 16, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
