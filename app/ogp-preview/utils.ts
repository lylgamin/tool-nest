export interface OgpFields {
  title: string
  description: string
  url: string
  imageUrl: string
  siteName: string
  type: string
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite: string
  twitterCreator: string
}

export function buildOgpTags(fields: OgpFields): string {
  const tags: string[] = []

  const add = (prop: string, content: string) => {
    if (content.trim()) {
      tags.push(`<meta property="${prop}" content="${content.replace(/"/g, '&quot;')}" />`)
    }
  }
  const addName = (name: string, content: string) => {
    if (content.trim()) {
      tags.push(`<meta name="${name}" content="${content.replace(/"/g, '&quot;')}" />`)
    }
  }

  add('og:title', fields.title)
  add('og:description', fields.description)
  add('og:url', fields.url)
  add('og:image', fields.imageUrl)
  add('og:site_name', fields.siteName)
  add('og:type', fields.type || 'website')

  addName('twitter:card', fields.twitterCard || 'summary_large_image')
  addName('twitter:title', fields.title)
  addName('twitter:description', fields.description)
  if (fields.imageUrl) addName('twitter:image', fields.imageUrl)
  if (fields.twitterSite) addName('twitter:site', fields.twitterSite.startsWith('@') ? fields.twitterSite : '@' + fields.twitterSite)
  if (fields.twitterCreator) addName('twitter:creator', fields.twitterCreator.startsWith('@') ? fields.twitterCreator : '@' + fields.twitterCreator)

  return tags.join('\n')
}

export function validateOgp(fields: OgpFields): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!fields.title.trim()) errors.title = 'タイトルは必須です'
  else if (fields.title.length > 60) errors.title = `タイトルは60文字以内推奨（現在: ${fields.title.length}文字）`
  if (fields.description.length > 160) errors.description = `説明は160文字以内推奨（現在: ${fields.description.length}文字）`
  if (fields.url && !/^https?:\/\//.test(fields.url)) errors.url = 'URLはhttp://またはhttps://で始まる必要があります'
  if (fields.imageUrl && !/^https?:\/\//.test(fields.imageUrl)) errors.imageUrl = '画像URLはhttp://またはhttps://で始まる必要があります'
  return errors
}
