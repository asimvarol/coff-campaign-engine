import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/campaigns',
    '/brand',
    '/photoshoot',
    '/publish',
    '/analytics',
    '/autopilot',
    '/agency',
  ]

  return routes.map((route) => ({
    url: `https://coff.app${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
