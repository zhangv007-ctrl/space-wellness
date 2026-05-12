import '../../globals.css'
'use client'
import { use, useState } from 'react'
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

const NO_SIDEBAR = ['', '/', '/login', '/reset-password']

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const pathname = usePathname()
  const localePath = pathname.replace(`/${locale}`, '') || '/'
  const showSidebar = !NO_SIDEBAR.includes(localePath)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!showSidebar) {
    return (
      <html lang={locale}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF7F2' }}>

        {/* Mobile Header - hidden on md+ */}
        <header className="mobile-header" style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"#fff", borderBottom:"1px solid #E8DDD0", padding:"12px 16px", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <a href={`/${locale}`} style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#3D2B1F' }}>Space </span>
            <em style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#8B6F52' }}>Wellness</em>
          </a>
          <div className="flex gap-3 items-center">
            <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} className="text-xs text-stone-500 border border-stone-200 rounded px-2 py-1" style={{ textDecoration: 'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
            <a href={`/${locale}/login`} className="text-xs text-red-500" style={{ textDecoration: 'none' }}>登出</a>
          </div>
        </header>

        <div className="desktop-layout" style={{ display:"flex", height:"100vh" }}>
          {/* Sidebar - hidden on mobile */}
          <nav className="sidebar-nav" style={{ width:200, background:"#fff", borderRight:"1px solid #E8DDD0", padding:"24px 0", flexShrink:0, overflowY:"auto" as const, display:"flex", flexDirection:"column" as const }} style={{ width: 200, background: '#fff', borderRight: '1px solid #E8DDD0', padding: '24px 0', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #E8DDD0', marginBottom: 8 }}>
              <a href={`/${locale}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#3D2B1F' }}>Space </span>
                <em style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: '#8B6F52' }}>Wellness</em>
              </a>
            </div>
            {NAV.map(group => (
              <div key={group.group} style={{ marginBottom: 8 }}>
                <div style={{ padding: '8px 20px 4px', fontSize: 10, letterSpacing: '.1em', color: '#C9B89E', textTransform: 'uppercase' as const }}>{group.group}</div>
                {group.items.map(item => {
                  const active = pathname.includes(item.href)
                  return (
                    <a key={item.href} href={`/${locale}${item.href}`}
                      style={{ display: 'block', padding: '9px 20px', fontSize: 13, color: active ? '#3D2B1F' : '#8B6F52', textDecoration: 'none', background: active ? '#F2EDE4' : 'transparent', borderRight: active ? '2px solid #3D2B1F' : 'none', fontWeight: active ? 500 : 400 }}>
                      {item.label}
                    </a>
                  )
                })}
              </div>
            ))}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E8DDD0', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize: 12, color: '#8B6F52', textDecoration: 'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
                <a href={`/${locale}/login`} style={{ fontSize: 12, color: '#C0544A', textDecoration: 'none' }}>Sign Out</a>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="main-area" style={{ flex:1, overflowY:"auto" as const }}>
            {children}
          </main>
        </div>

        {/* Mobile Tab Bar - hidden on md+ */}
        <nav className="mobile-tabbar" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background:"#fff", borderTop:"1px solid #E8DDD0", height:64 }}>
          {TAB_ITEMS.map(item => {
            const active = pathname.includes(item.href)
            return (
              <a key={item.href} href={`/${locale}${item.href}`}
                className="flex-1 flex flex-col items-center justify-center gap-0.5"
                style={{ textDecoration: 'none', background: active ? '#FAF7F2' : 'transparent', borderTop: active ? '2px solid #8B6F52' : '2px solid transparent' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 10, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </a>
            )
          })}
          <button onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5"
            style={{ background: 'transparent', border: 'none', borderTop: '2px solid transparent', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>☰</span>
            <span style={{ fontSize: 10, color: '#8B6F52' }}>More</span>
          </button>
        </nav>

        {/* Drawer */}
        {drawerOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setDrawerOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-5 pb-20 max-h-[80vh] overflow-y-auto md:hidden">
              <div className="w-10 h-1 bg-stone-200 rounded mx-auto mb-5" />
              {NAV.map(group => (
                <div key={group.group} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: '.1em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{group.group}</div>
                  {group.items.map(item => {
                    const active = pathname.includes(item.href)
                    return (
                      <a key={item.href} href={`/${locale}${item.href}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 rounded-xl mb-1"
                        style={{ padding: '12px 16px', textDecoration: 'none', background: active ? '#F2EDE4' : 'transparent' }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <span style={{ fontSize: 15, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                      </a>
                    )
                  })}
                </div>
              ))}
              <div className="flex gap-3 pt-2 border-t border-stone-100">
                <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize: 13, color: '#8B6F52', textDecoration: 'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
                <a href={`/${locale}/login`} style={{ fontSize: 13, color: '#C0544A', textDecoration: 'none' }}>Sign Out</a>
              </div>
            </div>
          </>
        )}

      </body>
    </html>
  )
}
