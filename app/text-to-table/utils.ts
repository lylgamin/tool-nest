export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

/**
 * CSVまたはTSVテキストをMarkdownテーブルに変換する
 * 1行目をヘッダー、2行目以降をデータ行として扱う
 * セル内の | は \| にエスケープ
 */
export function csvToMarkdownTable(input: string, delimiter: '\t' | ','): Result<string> {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: '入力が空です' }

  const lines = trimmed.split('\n').map(l => l.trimEnd())
  if (lines.length < 1) return { ok: false, error: '入力が空です' }

  const parseRow = (line: string): string[] =>
    line.split(delimiter).map(cell => cell.trim().replace(/\|/g, '\\|'))

  const headers = parseRow(lines[0])
  const colCount = headers.length

  const headerRow = '| ' + headers.join(' | ') + ' |'
  const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |'

  const dataRows = lines.slice(1).map(line => {
    const cells = parseRow(line)
    // 列数が足りない場合は空文字で埋める
    while (cells.length < colCount) cells.push('')
    return '| ' + cells.slice(0, colCount).join(' | ') + ' |'
  })

  const result = [headerRow, separatorRow, ...dataRows].join('\n')
  return { ok: true, output: result }
}
