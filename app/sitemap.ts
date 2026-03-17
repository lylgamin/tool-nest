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
  { path: '/contrast-checker',    lastModified: new Date('2026-03-17') },
  { path: '/gitignore-generator', lastModified: new Date('2026-03-17') },
  { path: '/git-commit-builder',  lastModified: new Date('2026-03-17') },
  { path: '/qr-generator',        lastModified: new Date('2026-03-17') },
  { path: '/curl-to-fetch',       lastModified: new Date('2026-03-17') },
  { path: '/ogp-preview',         lastModified: new Date('2026-03-17') },
  { path: '/text-diff',           lastModified: new Date('2026-03-17') },
  { path: '/char-code',           lastModified: new Date('2026-03-17') },
  { path: '/json-path',           lastModified: new Date('2026-03-17') },
  { path: '/password-strength',   lastModified: new Date('2026-03-17') },
  { path: '/color-converter',     lastModified: new Date('2026-03-18') },
]

const categories = [
  { path: '/category/text',     lastModified: new Date('2026-03-18') },
  { path: '/category/encode',   lastModified: new Date('2026-03-18') },
  { path: '/category/format',   lastModified: new Date('2026-03-18') },
  { path: '/category/convert',  lastModified: new Date('2026-03-18') },
  { path: '/category/generate', lastModified: new Date('2026-03-18') },
  { path: '/category/calc',     lastModified: new Date('2026-03-18') },
  { path: '/category/ref',      lastModified: new Date('2026-03-18') },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map(tool => ({
    url: `${BASE_URL}${tool.path}`,
    lastModified: tool.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryPages = categories.map(cat => ({
    url: `${BASE_URL}${cat.path}`,
    lastModified: cat.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date('2026-03-17'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    ...toolPages,
    ...categoryPages,
  ]
}
