export type ConvertResult<T> = { ok: true; output: T } | { ok: false; error: string }

/** Parse CSV string to array of row arrays */
export function parseCsv(csv: string): ConvertResult<string[][]> {
  if (!csv.trim()) return { ok: false, error: '入力が空です' }
  try {
    const rows: string[][] = []
    const lines = csv.split('\n')
    for (const line of lines) {
      if (line.trim() === '') continue
      rows.push(parseCsvLine(line))
    }
    if (rows.length === 0) return { ok: false, error: 'データが見つかりません' }
    return { ok: true, output: rows }
  } catch (e) {
    return { ok: false, error: `CSVの解析に失敗: ${String(e)}` }
  }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      // quoted cell
      let j = i + 1
      let cell = ''
      while (j < line.length) {
        if (line[j] === '"' && line[j+1] === '"') { cell += '"'; j += 2 }
        else if (line[j] === '"') { j++; break }
        else { cell += line[j]; j++ }
      }
      cells.push(cell)
      i = j
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end < 0) { cells.push(line.slice(i)); break }
      cells.push(line.slice(i, end))
      i = end + 1
    }
  }
  // trailing comma
  if (line.endsWith(',')) cells.push('')
  return cells
}

/** Convert CSV string → JSON array of objects */
export function csvToJson(csv: string): ConvertResult<string> {
  const parsed = parseCsv(csv)
  if (!parsed.ok) return parsed
  const [header, ...dataRows] = parsed.output
  if (!header || header.length === 0) return { ok: false, error: 'ヘッダー行が見つかりません' }
  const objects = dataRows.map(row => {
    const obj: Record<string, string | number> = {}
    header.forEach((key, i) => {
      const raw = row[i] ?? ''
      // try numeric
      const num = Number(raw)
      obj[key.trim()] = raw !== '' && !isNaN(num) ? num : raw
    })
    return obj
  })
  return { ok: true, output: JSON.stringify(objects, null, 2) }
}

/** Convert JSON array of objects → CSV */
export function jsonToCsv(json: string): ConvertResult<string> {
  if (!json.trim()) return { ok: false, error: '入力が空です' }
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch (e) {
    return { ok: false, error: `JSONの解析に失敗: ${e instanceof SyntaxError ? e.message : String(e)}` }
  }
  if (!Array.isArray(parsed)) return { ok: false, error: 'JSONはオブジェクトの配列である必要があります' }
  if (parsed.length === 0) return { ok: true, output: '' }
  const headers = Object.keys(parsed[0] as Record<string, unknown>)
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const lines = [
    headers.map(h => escape(h)).join(','),
    ...(parsed as Record<string, unknown>[]).map(row => headers.map(h => escape(row[h])).join(',')),
  ]
  return { ok: true, output: lines.join('\n') }
}
