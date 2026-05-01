'use client'

import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher'

interface TopbarProps {
  userName: string
  role: 'admin' | 'teacher' | 'client'
  initials: string
}

export function Topbar({ userName, role, initials }: TopbarProps) {
  const t = useTranslations()

  const roleLabel = {
    admin:   t('roles.admin'),
    teacher: t('roles.teacher'),
    client:  t('roles.client'),
  }[role]

  return (
    <header className="topbar">
      <div className="logo">
        Space <span>Wellness</span>
      </div>
      <div className="topbar-right">
        <LanguageSwitcher />
        <div className="role-badge">{roleLabel}</div>
        <span className="text-sm text-muted">{userName}</span>
        <div className="avatar">{initials}</div>
      </div>
    </header>
  )
}
