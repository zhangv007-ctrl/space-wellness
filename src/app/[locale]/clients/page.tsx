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
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>{zh ? '客户管理' : 'Clients'}</h1>
          <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>{zh ? `共 ${clients.length} 名用户` : `${clients.length} registered users`}</p>
        </div>
        <input
          placeholder={zh ? '搜索姓名或电话…' : 'Search name or phone…'}
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2', outline: 'none', width: 220 }}
        />
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid #E8DDD0' }}>
            {[zh ? '姓名' : 'Name', zh ? '电话' : 'Phone', zh ? '角色' : 'Role', zh ? '注册时间' : 'Joined', zh ? '操作' : 'Actions'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C9B89E', fontWeight: 500 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#8B6F52' }}>{zh ? '没有找到用户' : 'No users found'}</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F2EDE4' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F2EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#8B6F52', fontWeight: 600 }}>
                      {(c.full_name || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 500, color: '#3D2B1F' }}>{c.full_name || (zh ? '未填写' : 'No name')}</div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#8B6F52' }}>{c.phone || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: roleColor[c.role] + '22', color: roleColor[c.role], padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                    {roleLabel(c.role || 'client')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#8B6F52' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={c.role || 'client'} onChange={e => handleRoleChange(c.id, e.target.value)}
                    style={{ padding: '5px 10px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 12, background: '#FAF7F2', cursor: 'pointer' }}>
                    <option value="client">{zh ? '客户' : 'Client'}</option>
                    <option value="instructor">{zh ? '教师' : 'Instructor'}</option>
                    <option value="admin">{zh ? '管理员' : 'Admin'}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
