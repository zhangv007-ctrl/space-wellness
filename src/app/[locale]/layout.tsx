import { headers } from 'next/headers'
import { usePathname } from 'next/navigation'
import MobileNav from '../../components/MobileNav'

const NAV = [
  { group: 'OVERVIEW', items: [{ label: 'Dashboard', href: '/dashboard' }] },
  { group: 'MANAGEMENT', items: [
    { label: 'Clients', href: '/clients' },
    { label: 'Classes', href: '/classes' },
    { label: 'Spaces', href: '/spaces' },
    { label: 'Bookings', href: '/bookings' },
  ]},
  { group: 'PORTAL', items: [
    { label: 'Book a Class', href: '/book-class' },
    { label: 'My Schedule', href: '/my-schedule' },
    { label: 'Rent a Space', href: '/rent-space' },
  ]},
]

const NO_SIDEBAR = ['', '/', '/login', '/reset-password']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const localePath = pathname.replace(`/${locale}`, '') || '/'
  const showSidebar = !NO_SIDEBAR.includes(localePath)
  
  const ua = headersList.get('user-agent') || ''
  const isMobile = /iPhone|iPad|Android|Mobile/i.test(ua)

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

  if (isMobile) {
    return (
      <html lang={locale}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style={{ margin:0, fontFamily:'system-ui, sans-serif', background:'#FAF7F2' }}>
          <MobileNav locale={locale} localePath={localePath} />
          <main style={{ paddingTop:56, paddingBottom:72, minHeight:'100vh', padding:'72px 16px 80px' }}>
            {children}
          </main>
        </body>
      </html>
    )
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin:0, fontFamily:'system-ui, sans-serif', background:'#FAF7F2' }}>
        <div style={{ display:'flex', height:'100vh' }}>
          <nav style={{ width:200, background:'#fff', borderRight:'1px solid #E8DDD0', padding:'24px 0', flexShrink:0, overflowY:'auto', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'0 20px 24px', borderBottom:'1px solid #E8DDD0', marginBottom:8 }}>
              <a href={`/${locale}`} style={{ textDecoration:'none' }}>
                <span style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#3D2B1F' }}>Space </span>
                <em style={{ fontFamily:'Georgia,serif', fontSize:16, color:'#8B6F52' }}>Wellness</em>
              </a>
            </div>
            {NAV.map(group => (
              <div key={group.group} style={{ marginBottom:8 }}>
                <div style={{ padding:'8px 20px 4px', fontSize:10, letterSpacing:'.1em', color:'#C9B89E', textTransform:'uppercase' }}>{group.group}</div>
                {group.items.map(item => (
                  <a key={item.href} href={`/${locale}${item.href}`}
                    style={{ display:'block', padding:'9px 20px', fontSize:13, color:'#8B6F52', textDecoration:'none' }}>
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
            <div style={{ padding:'16px 20px', borderTop:'1px solid #E8DDD0', marginTop:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <a href={`/${locale === 'zh' ? 'en' : 'zh'}${localePath}`} style={{ fontSize:12, color:'#8B6F52', textDecoration:'none' }}>{locale === 'zh' ? 'EN' : '中文'}</a>
                <a href={`/${locale}/login`} style={{ fontSize:12, color:'#C0544A', textDecoration:'none' }}>Sign Out</a>
              </div>
            </div>
          </nav>
          <main style={{ flex:1, padding:28, overflowY:'auto' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
