'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function LanguageSwitcher() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: string) {
    if (next === locale) return
    // Swap the locale segment in the current path
    // Paths are: /en/dashboard  → /zh/dashboard
    const segments = pathname.split('/')
    segments[1] = next
    startTransition(() => {
      router.replace(segments.join('/'))
    })
  }

  return (
    <div className="lang-switcher" aria-label={t('language')}>
      <button
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => switchLocale('en')}
        disabled={isPending}
      >
        EN
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${locale === 'zh' ? 'active' : ''}`}
        onClick={() => switchLocale('zh')}
        disabled={isPending}
      >
        中文
      </button>
    </div>
  )
}
