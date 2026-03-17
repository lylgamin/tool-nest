export type FormatResult = { ok: true; output: string } | { ok: false; error: string }

const KEYWORDS = [
  'SELECT','FROM','WHERE','AND','OR','NOT','IN','IS','NULL','LIKE','BETWEEN',
  'ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET','JOIN','LEFT JOIN','RIGHT JOIN',
  'INNER JOIN','OUTER JOIN','FULL JOIN','CROSS JOIN','ON','AS','DISTINCT',
  'INSERT INTO','INSERT','VALUES','UPDATE','SET','DELETE FROM','DELETE',
  'CREATE TABLE','CREATE','DROP TABLE','DROP','ALTER TABLE','ALTER',
  'ADD COLUMN','ADD','COLUMN','INDEX','UNIQUE','PRIMARY KEY','FOREIGN KEY',
  'REFERENCES','DEFAULT','NOT NULL','AUTO_INCREMENT','WITH','UNION','UNION ALL',
  'INTERSECT','EXCEPT','CASE','WHEN','THEN','ELSE','END','CAST','COALESCE',
  'EXISTS','ALL','ANY',
]

// Tokenizer: split SQL into tokens (keywords, identifiers, strings, operators, whitespace)
type TokenKind = 'keyword' | 'string' | 'identifier' | 'number' | 'operator' | 'paren' | 'comma' | 'semicolon' | 'whitespace' | 'comment' | 'other'
interface Token { kind: TokenKind; value: string }

function tokenize(sql: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < sql.length) {
    // line comment
    if (sql[i] === '-' && sql[i+1] === '-') {
      const end = sql.indexOf('\n', i)
      const v = end < 0 ? sql.slice(i) : sql.slice(i, end + 1)
      tokens.push({ kind: 'comment', value: v })
      i += v.length
      continue
    }
    // block comment
    if (sql[i] === '/' && sql[i+1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      const v = end < 0 ? sql.slice(i) : sql.slice(i, end + 2)
      tokens.push({ kind: 'comment', value: v })
      i += v.length
      continue
    }
    // string literal (single or double quote)
    if (sql[i] === "'" || sql[i] === '"') {
      const q = sql[i]
      let j = i + 1
      while (j < sql.length) {
        if (sql[j] === '\\') { j += 2; continue }
        if (sql[j] === q) { j++; break }
        j++
      }
      tokens.push({ kind: 'string', value: sql.slice(i, j) })
      i = j
      continue
    }
    // backtick identifier
    if (sql[i] === '`') {
      let j = i + 1
      while (j < sql.length && sql[j] !== '`') j++
      tokens.push({ kind: 'identifier', value: sql.slice(i, j + 1) })
      i = j + 1
      continue
    }
    // whitespace
    if (/\s/.test(sql[i])) {
      let j = i + 1
      while (j < sql.length && /\s/.test(sql[j])) j++
      tokens.push({ kind: 'whitespace', value: sql.slice(i, j) })
      i = j
      continue
    }
    // number
    if (/[0-9]/.test(sql[i])) {
      let j = i + 1
      while (j < sql.length && /[0-9.]/.test(sql[j])) j++
      tokens.push({ kind: 'number', value: sql.slice(i, j) })
      i = j
      continue
    }
    // parens
    if (sql[i] === '(' || sql[i] === ')') {
      tokens.push({ kind: 'paren', value: sql[i] })
      i++
      continue
    }
    if (sql[i] === ',') {
      tokens.push({ kind: 'comma', value: ',' })
      i++
      continue
    }
    if (sql[i] === ';') {
      tokens.push({ kind: 'semicolon', value: ';' })
      i++
      continue
    }
    // operator or word
    if (/[a-zA-Z_]/.test(sql[i])) {
      let j = i + 1
      while (j < sql.length && /[a-zA-Z0-9_]/.test(sql[j])) j++
      tokens.push({ kind: 'other', value: sql.slice(i, j) })
      i = j
      continue
    }
    tokens.push({ kind: 'operator', value: sql[i] })
    i++
  }
  return tokens
}

// Main newline-before keywords (these go on their own line)
const NEWLINE_BEFORE = new Set([
  'SELECT','FROM','WHERE','AND','OR','HAVING','ORDER BY','GROUP BY',
  'LIMIT','OFFSET','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
  'FULL JOIN','CROSS JOIN','ON','UNION','UNION ALL','INTERSECT','EXCEPT',
  'INSERT INTO','INSERT','VALUES','UPDATE','SET','DELETE FROM','DELETE',
  'CREATE TABLE','CREATE','DROP TABLE','DROP','ALTER TABLE','ALTER',
  'WITH',
])

export function formatSql(sql: string, indent: string = '  '): FormatResult {
  if (!sql.trim()) return { ok: false, error: '入力が空です' }
  try {
    const tokens = tokenize(sql)
    // uppercase keywords and rebuild
    const words = tokens.map(t => {
      if (t.kind === 'whitespace' || t.kind === 'comment') return t
      const up = t.value.toUpperCase()
      if (KEYWORDS.includes(up)) return { kind: 'keyword' as TokenKind, value: up }
      return t
    })
    // Multi-word keyword detection: ORDER BY, GROUP BY, LEFT JOIN, etc.
    const multiKeywords = KEYWORDS.filter(k => k.includes(' ')).sort((a,b) => b.length - a.length)

    // Build output with newlines
    let out = ''
    let depth = 0

    const nonWS = words.filter(t => t.kind !== 'whitespace')

    for (let idx = 0; idx < nonWS.length; idx++) {
      const t = nonWS[idx]
      // try multi-word keyword
      let matched = ''
      for (const mk of multiKeywords) {
        const parts = mk.split(' ')
        let ok = true
        for (let p = 0; p < parts.length; p++) {
          const nt = nonWS[idx + p]
          if (!nt || nt.value.toUpperCase() !== parts[p]) { ok = false; break }
        }
        if (ok) { matched = mk; break }
      }
      if (matched) {
        if (NEWLINE_BEFORE.has(matched)) {
          out = out.trimEnd()
          out += '\n' + indent.repeat(depth > 0 ? 1 : 0) + matched
        } else {
          out += ' ' + matched
        }
        idx += matched.split(' ').length - 1
        continue
      }

      if (t.kind === 'keyword') {
        const v = t.value
        if (NEWLINE_BEFORE.has(v)) {
          out = out.trimEnd()
          out += '\n' + indent.repeat(depth > 0 ? 1 : 0) + v
        } else {
          out += ' ' + v
        }
      } else if (t.kind === 'paren') {
        if (t.value === '(') {
          out += '('
          depth++
        } else {
          depth = Math.max(0, depth - 1)
          out = out.trimEnd()
          out += ')'
        }
      } else if (t.kind === 'comma') {
        out += ','
        // newline after comma at top level
        if (depth <= 1) out += '\n' + indent
        else out += ' '
      } else if (t.kind === 'semicolon') {
        out = out.trimEnd()
        out += ';\n'
      } else if (t.kind === 'comment') {
        out += '\n' + t.value.trim() + '\n'
      } else {
        out += ' ' + t.value
      }
    }
    return { ok: true, output: out.trim() }
  } catch (e) {
    return { ok: false, error: `フォーマットエラー: ${String(e)}` }
  }
}

export function minifySql(sql: string): FormatResult {
  if (!sql.trim()) return { ok: false, error: '入力が空です' }
  try {
    // remove comments, collapse whitespace
    const out = sql
      .replace(/--[^\n]*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return { ok: true, output: out }
  } catch (e) {
    return { ok: false, error: `エラー: ${String(e)}` }
  }
}
