'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminNav = [
  { key: 'dashboard',  href: '/dashboard',  icon: 'grid' },
  { key: 'clients',   href: '/clients',    icon: 'user' },
  { key: 'classes',   href: '/classes',    icon: 'calendar' },
  { key: 'spaces',    href: '/spaces',     icon: 'home' },
  { key: 'bookings',  href: '/bookings',   icon: 'receipt' },
]

const portalNav = [
  { key: 'bookClass',    href: '/book-class',    icon: 'clock' },
  { key: 'mySchedule',  href: '/my-schedule',   icon: 'list' },
  { key: 'rentSpace',   href: '/rent-space',    icon: 'plus' },
]

export function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  const isActive = (href: string) => pathname.includes(href)

  return (
    <aside className="sidebar">
      <div className="nav-section">{t('overview')}</div>
      {adminNav.slice(0, 1).map(item => (
        <Link
          key={item.key}
          href={`/${locale}${item.href}`}
          className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
        >
          <NavIcon type={item.icon} />
          {t(item.key as any)}
        </Link>
      ))}

      <div className="nav-section">{t('management')}</div>
      {adminNav.slice(1).map(item => (
        <Link
          key={item.key}
          href={`/${locale}${item.href}`}
          className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
        >
          <NavIcon type={item.icon} />
          {t(item.key as any)}
        </Link>
      ))}

      <div className="nav-section">{t('portal')}</div>
      {portalNav.map(item => (
        <Link
          key={item.key}
          href={`/${locale}${item.href}`}
          className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
        >
          <NavIcon type={item.icon} />
          {t(item.key as any)}
        </Link>
      ))}
    </aside>
  )
}

function NavIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    grid:     'M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z',
    user:     'M8 8a3 3 0 100-6 3 3 0 000 6zM2 14c0-3.3 2.7-6 6-6s6 2.7 6 6',
    calendar: 'M1 4h14v11H1zM5 4V2M11 4V2M1 8h14',
    home:     'M1 14V5l7-4 7 4v9M6 14v-4h4v4',
    receipt:  'M13 2H3a1 1 0 00-1 1v11l3-2 2 2 2-2 2 2 3 2V3a1 1 0 00-1-1zM4 6h8M4 9h6M4 12h4',
    clock:    'M8 8a7 7 0 100-14A7 7 0 008 8zM8 4v4l2 2',
    list:     'M4 6h8M4 9h6M4 12h4M1 2h14v13H1z',
    plus:     'M8 1v14M1 8h14',
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{flexShrink: 0, opacity: 0.7}}>
      <path d={icons[type]} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
