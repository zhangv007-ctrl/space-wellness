import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // URL structure: /en/dashboard  /zh/dashboard
  localePrefix: 'always',
})
