export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://tool-nest.pages.dev'

const tools = [
  { path: '/character-count',  lastModified: new Date('2026-03-16') },
  { path: '/wareki',           lastModified: new Date('2026-03-16') },
  { path: '/japan-holidays',   lastModified: new Date('2026-03-16') },
  { path: '/business-days',    lastModified: new Date('2026-03-16') },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map(tool => ({
    url: `${BASE_URL}${tool.path}`,
    lastModified: tool.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolPages,
  ]
}
