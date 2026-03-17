export type ConvertResult = { ok: true; output: string } | { ok: false; error: string }
export type OutputFormat = 'fetch' | 'axios' | 'python'

interface ParsedCurl {
  url: string
  method: string
  headers: Record<string, string>
  body: string | null
  isJson: boolean
}

function tokenize(cmd: string): string[] {
  const tokens: string[] = []
  let i = 0
  while (i < cmd.length) {
    if (/\s/.test(cmd[i])) { i++; continue }
    if (cmd[i] === '"' || cmd[i] === "'") {
      const q = cmd[i]; let j = i + 1; let s = ''
      while (j < cmd.length) {
        if (cmd[j] === '\\' && j + 1 < cmd.length) { s += cmd[j+1]; j += 2 }
        else if (cmd[j] === q) { j++; break }
        else { s += cmd[j]; j++ }
      }
      tokens.push(s); i = j
    } else if (cmd[i] === '\\' && cmd[i+1] === '\n') {
      i += 2
    } else {
      let j = i
      while (j < cmd.length && !/\s/.test(cmd[j]) && cmd[j] !== '"' && cmd[j] !== "'") j++
      tokens.push(cmd.slice(i, j)); i = j
    }
  }
  return tokens
}

export function parseCurl(cmd: string): ParsedCurl {
  const tokens = tokenize(cmd.replace(/\\\n/g, ' ').trim())
  let i = 0

  // skip 'curl'
  if (tokens[i]?.toLowerCase() === 'curl') i++

  let url = ''
  let method = ''
  const headers: Record<string, string> = {}
  let body: string | null = null

  while (i < tokens.length) {
    const tok = tokens[i]
    if (tok === '-X' || tok === '--request') {
      method = tokens[++i] ?? 'GET'
      i++
    } else if (tok === '-H' || tok === '--header') {
      const h = tokens[++i] ?? ''; i++
      const idx = h.indexOf(':')
      if (idx > 0) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim()
    } else if (tok === '-d' || tok === '--data' || tok === '--data-raw' || tok === '--data-binary') {
      body = tokens[++i] ?? ''; i++
    } else if (tok === '--json') {
      body = tokens[++i] ?? ''; i++
      headers['Content-Type'] = 'application/json'
      headers['Accept'] = 'application/json'
    } else if (tok === '-u' || tok === '--user') {
      const u = tokens[++i] ?? ''; i++
      headers['Authorization'] = 'Basic ' + btoa(u)
    } else if (tok === '--compressed' || tok === '-L' || tok === '--location' || tok === '-s' || tok === '--silent' || tok === '-v' || tok === '--verbose' || tok === '-k' || tok === '--insecure' || tok === '-i' || tok === '--include') {
      i++
    } else if (!tok.startsWith('-')) {
      url = tok; i++
    } else {
      i++
    }
  }

  if (!method) method = body ? 'POST' : 'GET'
  const ct = headers['Content-Type'] || headers['content-type'] || ''
  const isJson = ct.includes('json')

  return { url, method: method.toUpperCase(), headers, body: body ?? null, isJson }
}

export function toFetch(parsed: ParsedCurl): string {
  const { url, method, headers, body } = parsed
  const lines: string[] = []

  const hasHeaders = Object.keys(headers).length > 0
  const opts: string[] = []
  if (method !== 'GET') opts.push(`  method: '${method}'`)
  if (hasHeaders) {
    const headerLines = Object.entries(headers).map(([k, v]) => `    '${k}': '${v}'`)
    opts.push(`  headers: {\n${headerLines.join(',\n')}\n  }`)
  }
  if (body !== null) opts.push(`  body: ${JSON.stringify(body)}`)

  if (opts.length === 0) {
    lines.push(`const response = await fetch('${url}');`)
  } else {
    lines.push(`const response = await fetch('${url}', {`)
    lines.push(opts.join(',\n') + ',')
    lines.push(`});`)
  }
  lines.push(`const data = await response.json();`)
  return lines.join('\n')
}

export function toAxios(parsed: ParsedCurl): string {
  const { url, method, headers, body, isJson } = parsed
  const lines: string[] = []
  const opts: string[] = []

  if (Object.keys(headers).length > 0) {
    const headerLines = Object.entries(headers).map(([k, v]) => `    '${k}': '${v}'`)
    opts.push(`  headers: {\n${headerLines.join(',\n')}\n  }`)
  }

  let dataStr = ''
  if (body !== null) {
    if (isJson) {
      try { dataStr = JSON.stringify(JSON.parse(body), null, 2).split('\n').join('\n  ') } catch { dataStr = JSON.stringify(body) }
    } else {
      dataStr = JSON.stringify(body)
    }
    opts.push(`  data: ${dataStr}`)
  }

  const m = method.toLowerCase()
  if (opts.length === 0) {
    lines.push(`const { data } = await axios.${m}('${url}');`)
  } else {
    lines.push(`const { data } = await axios.${m}('${url}', {`)
    lines.push(opts.join(',\n') + ',')
    lines.push(`});`)
  }
  return lines.join('\n')
}

export function toPython(parsed: ParsedCurl): string {
  const { url, method, headers, body, isJson } = parsed
  const lines: string[] = ['import requests', '']
  const args: string[] = [`url = '${url}'`]

  if (Object.keys(headers).length > 0) {
    const headerLines = Object.entries(headers).map(([k, v]) => `    '${k}': '${v}'`)
    lines.push(`headers = {`)
    lines.push(...Object.entries(headers).map(([k, v]) => `    '${k}': '${v}',`))
    lines.push(`}`)
    lines.push('')
  }

  if (body !== null) {
    if (isJson) {
      try {
        const parsed2 = JSON.parse(body)
        const indent = JSON.stringify(parsed2, null, 4).split('\n').join('\n')
        lines.push(`payload = ${indent.replace(/"([^"]+)":/g, "'$1':").replace(/: "(.*?)"/g, ": '$1'")}`)
      } catch {
        lines.push(`payload = ${JSON.stringify(body)}`)
      }
    } else {
      lines.push(`payload = ${JSON.stringify(body)}`)
    }
    lines.push('')
  }

  const methodCased = method.charAt(0) + method.slice(1).toLowerCase()
  const callArgs = [`'${url}'`]
  if (Object.keys(headers).length > 0) callArgs.push('headers=headers')
  if (body !== null) {
    if (isJson) callArgs.push('json=payload')
    else callArgs.push('data=payload')
  }

  lines.push(`response = requests.${methodCased}(${callArgs.join(', ')})`)
  lines.push(`data = response.json()`)
  return lines.join('\n')
}

export function convertCurl(cmd: string, format: OutputFormat): ConvertResult {
  const trimmed = cmd.trim()
  if (!trimmed) return { ok: false, error: '入力が空です' }
  if (!trimmed.toLowerCase().startsWith('curl')) return { ok: false, error: 'curlコマンドを入力してください（"curl "で始まる必要があります）' }
  try {
    const parsed = parseCurl(trimmed)
    if (!parsed.url) return { ok: false, error: 'URLが見つかりませんでした' }
    const output = format === 'fetch' ? toFetch(parsed) : format === 'axios' ? toAxios(parsed) : toPython(parsed)
    return { ok: true, output }
  } catch (e) {
    return { ok: false, error: `変換エラー: ${String(e)}` }
  }
}
