'use client'
import { use, useState, useEffect } from 'react'
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

const ALL_ITEMS = NAV.flatMap(g => g.items)

// Bottom tab bar items (most important 5)
const TAB_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Clients', href: '/clients', icon: '👥' },
  { label: 'Classes', href: '/classes', icon: '🧘' },
  { label: 'Bookings', href: '/bookings', icon: '📅' },
  { label: 'More', href: '', icon: '☰' },
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
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!showSidebar) {
    return (
      <html lang={locale}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <style>{`
            *, *::before, *::after { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; overflow-x: hidden; max-width: 100%; }
            img { max-width: 100%; }
          `}</style>
        </head>
        <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
          {children}
        </body>
      </html>
    )
  }

  // Mobile layout
  if (isMobile) {
    return (
      <html lang={locale}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <style>{`
            *, *::before, *::after { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; overflow-x: hidden; }
          `}</style>
        </head>
        <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF7F2' }}>

          {/* 顶部 Header */}
          <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #E8DDD0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
            <a href={`/${locale}`} style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#3D2B1F' }}>Space </span>
              <em style={{ fontFamily: 'Georgia,serif', fontSize: 17, color: '#8B6F52' }}>Wellness</em>
            </a>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize: 12, color: '#8B6F52', textDecoration: 'none', padding: '4px 8px', border: '1px solid #E8DDD0', borderRadius: 4 }}>{locale === 'zh' ? 'EN' : '中文'}</a>
              <a href={`/${locale}/login`} style={{ fontSize: 12, color: '#C0544A', textDecoration: 'none' }}>登出</a>
            </div>
          </header>

          {/* 主内容区 */}
          <main style={{ paddingTop: 56, paddingBottom: 72, minHeight: '100vh', overflowY: 'auto' }}>
            {children}
          </main>

          {/* 底部 Tab Bar */}
          <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderTop: '1px solid #E8DDD0', display: 'flex', height: 64 }}>
            {TAB_ITEMS.map(item => {
              if (item.label === 'More') {
                return (
                  <button key="more" onClick={() => setDrawerOpen(true)}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', gap: 2, padding: 0 }}>
                    <span style={{ fontSize: 20 }}>☰</span>
                    <span style={{ fontSize: 10, color: '#8B6F52' }}>More</span>
                  </button>
                )
              }
              const active = pathname.includes(item.href)
              return (
                <a key={item.href} href={`/${locale}${item.href}`}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 2, padding: 0, background: active ? '#FAF7F2' : 'transparent' }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 10, color: active ? '#3D2B1F' : '#8B6F52', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                </a>
              )
            })}
          </nav>

          {/* More 抽屉菜单 */}
          {drawerOpen && (
            <>
              <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
              <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 16px 80px' }}>
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
              </div>
            </>
          )}

        </body>
      </html>
    )
  }

  // Desktop layout (原来的侧边栏)
  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF7F2' }}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <nav style={{ width: 200, background: '#fff', borderRight: '1px solid #E8DDD0', padding: '24px 0', flexShrink: 0, overflowY: 'auto' }}>
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
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E8DDD0', marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize: 12, color: '#8B6F52', textDecoration: 'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
                <a href={`/${locale}/login`} style={{ fontSize: 12, color: '#C0544A', textDecoration: 'none' }}>Sign Out</a>
              </div>
            </div>
          </nav>
          <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
