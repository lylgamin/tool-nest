export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://tool-nest.pages.dev'

const tools = [
  { path: '/character-count',  lastModified: new Date('2026-03-16') },
  { path: '/wareki',           lastModified: new Date('2026-03-16') },
  { path: '/japan-holidays',   lastModified: new Date('2026-03-16') },
  { path: '/business-days',    lastModified: new Date('2026-03-16') },
  { path: '/rokujukkanshi',    lastModified: new Date('2026-03-16') },
  { path: '/unix-time',        lastModified: new Date('2026-03-16') },
  { path: '/timezone',         lastModified: new Date('2026-03-16') },
  { path: '/day-of-year',      lastModified: new Date('2026-03-16') },
  { path: '/json-formatter',   lastModified: new Date('2026-03-16') },
  { path: '/base64',           lastModified: new Date('2026-03-16') },
  { path: '/uuid-generator',   lastModified: new Date('2026-03-16') },
  { path: '/url-encode',       lastModified: new Date('2026-03-17') },
  { path: '/html-escape',      lastModified: new Date('2026-03-17') },
  { path: '/hash',             lastModified: new Date('2026-03-17') },
  { path: '/zenkaku-hankaku', lastModified: new Date('2026-03-17') },
  { path: '/camel-case',      lastModified: new Date('2026-03-17') },
  { path: '/kebab-case',      lastModified: new Date('2026-03-17') },
  { path: '/regex-tester',    lastModified: new Date('2026-03-17') },
  { path: '/http-status',     lastModified: new Date('2026-03-17') },
  { path: '/jwt-decoder',     lastModified: new Date('2026-03-17') },
  { path: '/number-base',     lastModified: new Date('2026-03-17') },
  { path: '/url-parser',      lastModified: new Date('2026-03-17') },
  { path: '/byte-converter',  lastModified: new Date('2026-03-17') },
  { path: '/cron-parser',     lastModified: new Date('2026-03-17') },
  { path: '/date-diff',            lastModified: new Date('2026-03-17') },
  { path: '/password-generator',  lastModified: new Date('2026-03-17') },
  { path: '/html-to-jsx',         lastModified: new Date('2026-03-17') },
  { path: '/sql-formatter',       lastModified: new Date('2026-03-17') },
  { path: '/csv-json',            lastModified: new Date('2026-03-17') },
  { path: '/json-to-ts',          lastModified: new Date('2026-03-17') },
  { path: '/contrast-checker',   lastModified: new Date('2026-03-17') },
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
