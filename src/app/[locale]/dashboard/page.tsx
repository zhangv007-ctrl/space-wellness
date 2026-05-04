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

  const { count: clientCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

  const { data: todayClasses } = await supabase
    .from('classes')
    .select('*, spaces(name), profiles(full_name)')
    .gte('start_time', todayStart)
    .lt('start_time', todayEnd)
    .order('start_time')

  const { count: rentalCount } = await supabase
    .from('rentals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed')

  const { count: waitlistCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'waitlist')

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'
  const hour = now.getHours()
  const greeting = zh
    ? hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
    : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: zh ? '活跃客户' : 'Active Clients', val: String(clientCount ?? 0), sub: zh ? '注册用户' : 'Registered users', color: '#7A9E87' },
    { label: zh ? '今日课程' : 'Today Classes', val: String(todayClasses?.length ?? 0), sub: zh ? '已安排' : 'Scheduled', color: '#B89A5A' },
    { label: zh ? '场地租借' : 'Space Rentals', val: String(rentalCount ?? 0), sub: zh ? '已确认' : 'Confirmed', color: '#C9B89E' },
    { label: zh ? '候补人数' : 'Waitlisted', val: String(waitlistCount ?? 0), sub: zh ? '等待中' : 'Waiting', color: '#C0544A' },
  ]

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: '#3D2B1F', margin: 0 }}>
            {greeting}, {displayName} ✦
          </h1>
          <p style={{ color: '#8B6F52', margin: '4px 0 0', fontSize: 13 }}>
            {zh ? `今天安排了 ${todayClasses?.length ?? 0} 节课` : `${todayClasses?.length ?? 0} classes scheduled today`}
          </p>
        </div>
        <button style={{ background: '#3D2B1F', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          {zh ? '+ 新建课程' : '+ New Class'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(({ label, val, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: '18px 20px', borderTop: `2px solid ${color}` }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: '#C9B89E', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: '#3D2B1F', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color: '#8B6F52', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8DDD0', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#3D2B1F', margin: '0 0 16px' }}>
          {zh ? '今日课表' : "Today's Schedule"}
        </h2>
        {todayClasses && todayClasses.length > 0 ? todayClasses.map((cls: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i < todayClasses.length - 1 ? '1px solid #F2EDE4' : 'none' }}>
            <div style={{ width: 60, fontSize: 12, color: '#8B6F52', flexShrink: 0 }}>
              {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ flex: 1, background: '#F2EDE4', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid #7A9E87' }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: '#3D2B1F' }}>{cls.title}</div>
              <div style={{ fontSize: 12, color: '#8B6F52' }}>{cls.spaces?.name} · {cls.profiles?.full_name}</div>
            </div>
          </div>
        )) : (
          <p style={{ color: '#8B6F52', fontSize: 14 }}>{zh ? '今天没有安排课程' : 'No classes scheduled today'}</p>
        )}
      </div>
    </div>
  )
}
