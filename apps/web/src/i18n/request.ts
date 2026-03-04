import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

const SUPPORTED_LOCALES = ['en'] as const
const DEFAULT_LOCALE = 'en'

function parseAcceptLanguage(header: string): string {
  const first = header.split(',')[0]
  if (!first) return DEFAULT_LOCALE
  const lang = first.split(';')[0]!.trim().split('-')[0]!.toLowerCase()
  return (SUPPORTED_LOCALES as readonly string[]).includes(lang) ? lang : DEFAULT_LOCALE
}

export default getRequestConfig(async () => {
  const headersList = await headers()
  const acceptLanguage = headersList.get('Accept-Language') || ''
  const locale = parseAcceptLanguage(acceptLanguage)

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
