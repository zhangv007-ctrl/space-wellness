import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const zh = locale === 'zh'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id ?? '')
    .single()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: clientCount },
    { data: todayClasses },
    { count: rentalCount },
    { count: waitlistCount },
    { count: weekBookings },
    { count: monthBookings },
    { data: recentBookings },
    { data: confirmedRentals },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('classes').select('*, spaces(name)').gte('start_time', todayStart).lt('start_time', todayEnd).order('start_time'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'waitlist'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed').gte('created_at', weekStart),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed').gte('created_at', monthStart),
    supabase.from('bookings').select('*, profiles(full_name), classes(title, price)').eq('status', 'confirmed').order('created_at', { ascending: false }).limit(5),
    supabase.from('rentals').select('total_price').eq('status', 'confirmed').gte('created_at', monthStart),
  ])

  const monthRevenue = (confirmedRentals || []).reduce((sum: number, r: any) => sum + (r.total_price || 0), 0)
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'
  const hour = now.getHours()
  const greeting = zh
    ? hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
    : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: zh ? '活跃客户' : 'Active Clients', val: String(clientCount ?? 0), sub: zh ? '注册用户' : 'Registered users', color: '#7A9E87' },
    { label: zh ? '今日课程' : 'Today Classes', val: String(todayClasses?.length ?? 0), sub: zh ? '已安排' : 'Scheduled', color: '#B89A5A' },
    { label: zh ? '本周预约' : 'Week Bookings', val: String(weekBookings ?? 0), sub: zh ? '已确认' : 'Confirmed', color: '#C9B89E' },
    { label: zh ? '候补人数' : 'Waitlisted', val: String(waitlistCount ?? 0), sub: zh ? '等待中' : 'Waiting', color: '#C0544A' },
  ]

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3D2B1F', margin: 0, lineHeight: 1.2 }}>
            {greeting}, {displayName} ✦
          </h1>
          <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>
            {zh ? `今天安排了 ${todayClasses?.length ?? 0} 节课` : `${todayClasses?.length ?? 0} classes scheduled today`}
          </p>
        </div>
        <a href={`/${locale}/classes`} style={{ background: '#3D2B1F', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {zh ? '+ 新建课程' : '+ New Class'}
        </a>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 16 }}>
        {stats.map(({ label, val, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: '14px 16px', borderTop: `2px solid ${color}` }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: '#C9B89E', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color: '#8B6F52', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C4033)', borderRadius: 12, padding: '16px 20px', marginBottom: 16, color: '#fff' }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
          {zh ? '本月场地收入' : 'Monthly Space Revenue'}
        </div>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, marginBottom: 4 }}>${monthRevenue}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          {zh ? `${rentalCount} 笔已确认租用` : `${rentalCount} confirmed rentals`}
          {' · '}
          {zh ? `本月 ${monthBookings} 笔课程预约` : `${monthBookings} class bookings this month`}
        </div>
      </div>

      {/* Today Schedule */}
      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#3D2B1F', margin: '0 0 14px' }}>
          {zh ? '今日课表' : "Today's Schedule"}
        </h2>
        {todayClasses && todayClasses.length > 0 ? todayClasses.map((cls: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < todayClasses.length - 1 ? '1px solid #F2EDE4' : 'none' }}>
            <div style={{ width: 52, fontSize: 12, color: '#8B6F52', flexShrink: 0, paddingTop: 2 }}>
              {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ flex: 1, background: '#F2EDE4', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid #7A9E87' }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: '#3D2B1F' }}>{cls.title}</div>
              <div style={{ fontSize: 12, color: '#8B6F52', marginTop: 2 }}>{cls.spaces?.name || '—'}</div>
            </div>
          </div>
        )) : (
          <p style={{ color: '#8B6F52', fontSize: 14, margin: 0 }}>{zh ? '今天没有安排课程' : 'No classes scheduled today'}</p>
        )}
      </div>

      {/* Export Reports */}
      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#3D2B1F', margin: '0 0 14px' }}>
          {zh ? '导出报表' : 'Export Reports'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { type: 'bookings', label: zh ? '📋 预约记录' : '📋 Bookings' },
            { type: 'clients', label: zh ? '👥 客户列表' : '👥 Clients' },
            { type: 'rentals', label: zh ? '🏠 租用记录' : '🏠 Rentals' },
            { type: 'revenue', label: zh ? '💰 收入报表' : '💰 Revenue' },
          ].map(({ type, label }) => (
            <a key={type} href={`/api/export?type=${type}`} download
              style={{ display: 'block', textAlign: 'center', padding: '10px 8px', background: '#FAF7F2', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 13, color: '#3D2B1F', textDecoration: 'none', cursor: 'pointer' }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#3D2B1F', margin: '0 0 14px' }}>
          {zh ? '最新预约' : 'Recent Bookings'}
        </h2>
        {recentBookings && recentBookings.length > 0 ? recentBookings.map((b: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < recentBookings.length - 1 ? '1px solid #F2EDE4' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3D2B1F' }}>{b.profiles?.full_name || '—'}</div>
              <div style={{ fontSize: 12, color: '#8B6F52', marginTop: 2 }}>{b.classes?.title || '—'}</div>
            </div>
            <div style={{ fontSize: 13, color: '#7A9E87', fontWeight: 500 }}>${b.classes?.price || 0}</div>
          </div>
        )) : (
          <p style={{ color: '#8B6F52', fontSize: 14, margin: 0 }}>{zh ? '暂无预约记录' : 'No recent bookings'}</p>
        )}
      </div>
    </div>
  )
}
