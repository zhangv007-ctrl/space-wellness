'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV = [
  { group: 'OVERVIEW', items: [{ label: 'Dashboard', href: '/dashboard', icon: '📊' }] },
  { group: 'MANAGEMENT', items: [
    { label: 'Clients', href: '/clients', icon: '👥' },
    { label: 'Classes', href: '/classes', icon: '🧘' },
    { label: 'Spaces', href: '/spaces', icon: '🏠' },
    { label: 'Bookings', href: '/bookings', icon: '📅' },
  ]},
  { group: 'PORTAL', items: [
    { label: 'Book a Class', href: '/book-class', icon: '➕' },
    { label: 'My Schedule', href: '/my-schedule', icon: '🗓' },
    { label: 'Rent a Space', href: '/rent-space', icon: '🔑' },
  ]},
]

const TAB_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Clients', href: '/clients', icon: '👥' },
  { label: 'Classes', href: '/classes', icon: '🧘' },
  { label: 'Bookings', href: '/bookings', icon: '📅' },
]

export default function MobileNav({ locale, localePath }: { locale: string, localePath: string }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#fff', borderBottom:'1px solid #E8DDD0', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', height:56 }}>
        <a href={`/${locale}`} style={{ textDecoration:'none' }}>
          <span style={{ fontFamily:'Georgia,serif', fontSize:17, color:'#3D2B1F' }}>Space </span>
          <em style={{ fontFamily:'Georgia,serif', fontSize:17, color:'#8B6F52' }}>Wellness</em>
        </a>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize:12, color:'#8B6F52', textDecoration:'none', padding:'4px 8px', border:'1px solid #E8DDD0', borderRadius:4 }}>{locale === 'zh' ? 'EN' : '中文'}</a>
          <a href={`/${locale}/login`} style={{ fontSize:12, color:'#C0544A', textDecoration:'none' }}>登出</a>
        </div>
      </header>

      <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, background:'#fff', borderTop:'1px solid #E8DDD0', display:'flex', height:64 }}>
        {TAB_ITEMS.map(item => {
          const active = pathname.includes(item.href)
          return (
            <a key={item.href} href={`/${locale}${item.href}`}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textDecoration:'none', gap:2, background: active ? '#FAF7F2' : 'transparent', borderTop: active ? '2px solid #8B6F52' : '2px solid transparent' }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:10, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </a>
          )
        })}
        <button onClick={() => setDrawerOpen(true)}
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', borderTop:'2px solid transparent', cursor:'pointer', gap:2 }}>
          <span style={{ fontSize:20 }}>☰</span>
          <span style={{ fontSize:10, color:'#8B6F52' }}>More</span>
        </button>
      </nav>

      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200 }} />
          <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:'#fff', borderRadius:'16px 16px 0 0', padding:'20px 16px 80px', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, background:'#E8DDD0', borderRadius:2, margin:'0 auto 20px' }} />
            {NAV.map(group => (
              <div key={group.group} style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, letterSpacing:'.1em', color:'#C9B89E', textTransform:'uppercase', marginBottom:8, paddingLeft:4 }}>{group.group}</div>
                {group.items.map(item => {
                  const active = pathname.includes(item.href)
                  return (
                    <a key={item.href} href={`/${locale}${item.href}`}
                      onClick={() => setDrawerOpen(false)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, textDecoration:'none', background: active ? '#F2EDE4' : 'transparent', marginBottom:4 }}>
                      <span style={{ fontSize:20 }}>{item.icon}</span>
                      <span style={{ fontSize:15, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                    </a>
                  )
                })}
              </div>
            ))}
            <div style={{ display:'flex', gap:12, paddingTop:8, borderTop:'1px solid #E8DDD0' }}>
              <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize:13, color:'#8B6F52', textDecoration:'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
              <a href={`/${locale}/login`} style={{ fontSize:13, color:'#C0544A', textDecoration:'none' }}>Sign Out</a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
