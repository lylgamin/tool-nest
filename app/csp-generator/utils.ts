export type CspDirectiveDef = {
  name: string
  description: string
  defaultValues: string[]
}

export const CSP_DIRECTIVES: CspDirectiveDef[] = [
  { name: 'default-src', description: 'すべてのリソースのデフォルトポリシー', defaultValues: ["'self'"] },
  { name: 'script-src', description: 'JavaScriptのロード元を制御', defaultValues: ["'self'"] },
  { name: 'style-src', description: 'CSSのロード元を制御', defaultValues: ["'self'", "'unsafe-inline'"] },
  { name: 'img-src', description: '画像のロード元を制御', defaultValues: ["'self'", 'data:'] },
  { name: 'connect-src', description: 'fetch/XHR/WebSocketの接続先を制御', defaultValues: ["'self'"] },
  { name: 'font-src', description: 'フォントのロード元を制御', defaultValues: ["'self'"] },
  { name: 'object-src', description: 'プラグイン（object/embed）のロード元を制御', defaultValues: ["'none'"] },
  { name: 'media-src', description: 'audio/videoのロード元を制御', defaultValues: ["'self'"] },
  { name: 'frame-src', description: 'iframe/frameのロード元を制御', defaultValues: ["'none'"] },
  { name: 'form-action', description: 'フォームのsubmit先を制御', defaultValues: ["'self'"] },
]

export function buildCspHeader(config: Record<string, string[]>): string {
  return Object.entries(config)
    .filter(([, values]) => values.length > 0)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ')
}

export function parseCspHeader(header: string): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  const directives = header.split(';').map(d => d.trim()).filter(Boolean)
  for (const directive of directives) {
    const parts = directive.split(/\s+/)
    const name = parts[0].toLowerCase()
    const values = parts.slice(1)
    result[name] = values
  }
  return result
}
