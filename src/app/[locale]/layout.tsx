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

  const css = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; overflow-x: hidden; }
    .layout-wrap { display: flex; height: 100vh; }
    .sidebar { width: 200px; background: #fff; border-right: 1px solid #E8DDD0; padding: 24px 0; flex-shrink: 0; overflow-y: auto; display: flex; flex-direction: column; }
    .main-content { flex: 1; padding: 28px; overflow-y: auto; }
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #fff; border-bottom: 1px solid #E8DDD0; padding: 12px 16px; justify-content: space-between; align-items: center; height: 56px; }
    .mobile-tabbar { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: #fff; border-top: 1px solid #E8DDD0; height: 64px; }
    .mobile-drawer-overlay { display: none; }
    .mobile-drawer { display: none; }
    @media (max-width: 767px) {
      .sidebar { display: none !important; }
      .main-content { padding: 16px; padding-top: 72px; padding-bottom: 80px; }
      .layout-wrap { display: block; }
      .mobile-header { display: flex; }
      .mobile-tabbar { display: flex; }
      .mobile-drawer-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; }
      .mobile-drawer { display: block; position: fixed; bottom: 0; left: 0; right: 0; z-index: 201; background: #fff; border-radius: 16px 16px 0 0; padding: 20px 16px 80px; max-height: 80vh; overflow-y: auto; }
    }
  `

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF7F2' }}>

        <header className="mobile-header">
          <a href={`/${locale}`} style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#3D2B1F' }}>Space </span>
            <em style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#8B6F52' }}>Wellness</em>
          </a>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize: 12, color: '#8B6F52', textDecoration: 'none', padding: '4px 8px', border: '1px solid #E8DDD0', borderRadius: 4 }}>{locale === 'zh' ? 'EN' : '中文'}</a>
            <a href={`/${locale}/login`} style={{ fontSize: 12, color: '#C0544A', textDecoration: 'none' }}>登出</a>
          </div>
        </header>

        <div className="layout-wrap">
          <nav className="sidebar">
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
          <main className="main-content">{children}</main>
        </div>

        <nav className="mobile-tabbar">
          {TAB_ITEMS.map(item => {
            const active = pathname.includes(item.href)
            return (
              <a key={item.href} href={`/${locale}${item.href}`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 2, background: active ? '#FAF7F2' : 'transparent', borderTop: active ? '2px solid #8B6F52' : '2px solid transparent' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 10, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </a>
            )
          })}
          <button onClick={() => setDrawerOpen(true)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', gap: 2, borderTop: '2px solid transparent' }}>
            <span style={{ fontSize: 20 }}>☰</span>
            <span style={{ fontSize: 10, color: '#8B6F52' }}>More</span>
          </button>
        </nav>

        {drawerOpen && (
          <>
            <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="mobile-drawer">
              <div style={{ width: 40, height: 4, background: '#E8DDD0', borderRadius: 2, margin: '0 auto 20px' }} />
              {NAV.map(group => (
                <div key={group.group} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: '.1em', color: '#C9B89E', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{group.group}</div>
                  {group.items.map(item => {
                    const active = pathname.includes(item.href)
                    return (
                      <a key={item.href} href={`/${locale}${item.href}`}
                        onClick={() => setDrawerOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, textDecoration: 'none', background: active ? '#F2EDE4' : 'transparent', marginBottom: 4 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <span style={{ fontSize: 15, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                      </a>
                    )
                  })}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid #E8DDD0' }}>
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
