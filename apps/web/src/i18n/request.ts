import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'en' // TODO: Get from user preference or browser

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
