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
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [clientBookings, setClientBookings] = useState<any[]>([])
  const [clientRentals, setClientRentals] = useState<any[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

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

  const loadClientDetail = async (client: any) => {
    setSelectedClient(client)
    setDetailLoading(true)
    const [{ data: bookings }, { data: rentals }] = await Promise.all([
      supabase.from('bookings').select('*, classes(title, start_time, price)').eq('client_id', client.id).order('created_at', { ascending: false }),
      supabase.from('rentals').select('*, spaces(name)').eq('client_id', client.id).order('created_at', { ascending: false })
    ])
    setClientBookings(bookings || [])
    setClientRentals(rentals || [])
    setDetailLoading(false)
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
            <div key={c.id} onClick={() => loadClientDetail(c)} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
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

      {/* Client Detail Drawer */}
      {selectedClient && (
        <>
          <div onClick={() => setSelectedClient(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: '#fff', borderRadius: '16px 16px 0 0', padding: 20, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, background: '#E8DDD0', borderRadius: 2, margin: '0 auto 16px' }} />
            
            {/* Client Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F2EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#8B6F52', fontWeight: 600, flexShrink: 0 }}>
                {(selectedClient.full_name || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F' }}>{selectedClient.full_name || (zh ? '未填写' : 'No name')}</div>
                <div style={{ fontSize: 13, color: '#8B6F52', marginTop: 2 }}>{selectedClient.phone || '—'}</div>
                <div style={{ fontSize: 12, color: '#C9B89E', marginTop: 2 }}>{zh ? '注册：' : 'Joined: '}{new Date(selectedClient.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {detailLoading ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#8B6F52' }}>{zh ? '加载中…' : 'Loading…'}</div>
            ) : (
              <>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[
                    { label: zh ? '课程预约' : 'Bookings', val: clientBookings.filter(b => b.status === 'confirmed').length },
                    { label: zh ? '场地租用' : 'Rentals', val: clientRentals.filter(r => r.status === 'confirmed').length },
                    { label: zh ? '总消费' : 'Spent', val: '$' + clientBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.classes?.price || 0), 0) },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: '#FAF7F2', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#3D2B1F' }}>{stat.val}</div>
                      <div style={{ fontSize: 10, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Booking History */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6F52', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>{zh ? '预约记录' : 'Booking History'}</div>
                  {clientBookings.length === 0 ? (
                    <div style={{ color: '#C9B89E', fontSize: 13, padding: '12px 0' }}>{zh ? '暂无预约记录' : 'No bookings yet'}</div>
                  ) : clientBookings.slice(0, 5).map((b, i) => {
                    const statusC: Record<string, {bg:string,text:string}> = { confirmed: {bg:'#E8F2EA',text:'#3D7A4E'}, cancelled: {bg:'#FAEBE9',text:'#C0544A'}, waitlist: {bg:'#FDF3E0',text:'#8A6020'} }
                    const sc = statusC[b.status] || {bg:'#F2EDE4',text:'#8B6F52'}
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < clientBookings.slice(0,5).length-1 ? '1px solid #F2EDE4' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 13, color: '#3D2B1F', fontWeight: 500 }}>{b.classes?.title || '—'}</div>
                          <div style={{ fontSize: 11, color: '#8B6F52', marginTop: 2 }}>{b.classes?.start_time ? new Date(b.classes.start_time).toLocaleDateString() : '—'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, color: '#3D2B1F' }}>${b.classes?.price || 0}</span>
                          <span style={{ background: sc.bg, color: sc.text, padding: '2px 8px', borderRadius: 20, fontSize: 10 }}>
                            {{confirmed: zh?'已确认':'Confirmed', cancelled: zh?'已取消':'Cancelled', waitlist: zh?'候补':'Waitlist'}[b.status] || b.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Role Change */}
                <div style={{ borderTop: '1px solid #E8DDD0', paddingTop: 16 }}>
                  <div style={{ fontSize: 12, color: '#8B6F52', marginBottom: 8 }}>{zh ? '修改角色' : 'Change Role'}</div>
                  <select value={selectedClient.role || 'client'} onChange={e => { handleRoleChange(selectedClient.id, e.target.value); setSelectedClient((prev: any) => ({...prev, role: e.target.value})) }}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, background: '#FAF7F2' }}>
                    <option value="client">{zh ? '客户' : 'Client'}</option>
                    <option value="instructor">{zh ? '教师' : 'Instructor'}</option>
                    <option value="admin">{zh ? '管理员' : 'Admin'}</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div style={{ position: 'fixed', bottom: 80, right: 16, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
