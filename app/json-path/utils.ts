export type QueryResult =
  | { ok: true; results: unknown[]; count: number }
  | { ok: false; error: string }

// JSONPath のセグメント種別
type Segment =
  | { type: 'key'; key: string }
  | { type: 'index'; index: number }
  | { type: 'wildcard' }
  | { type: 'recursive'; key: string | null }

/**
 * JSONPath 式をセグメント列に分解する
 * 対応構文:
 *   $              - ルート
 *   $.foo          - プロパティアクセス
 *   $.foo.bar      - ネストプロパティ
 *   $.foo[0]       - 配列インデックス
 *   $.foo[-1]      - 後ろからのインデックス
 *   $.foo[*]       - 全要素
 *   $[*]           - ルートが配列の場合の全要素
 *   $.foo[0].bar   - 組み合わせ
 *   $..foo         - 再帰的検索（descendant）
 */
function parsePath(path: string): Segment[] | string {
  const trimmed = path.trim()
  if (!trimmed.startsWith('$')) {
    return 'パスは $ から始める必要があります'
  }

  const segments: Segment[] = []
  let i = 1 // '$' の次から

  while (i < trimmed.length) {
    // 再帰演算子 `..`
    if (trimmed[i] === '.' && trimmed[i + 1] === '.') {
      i += 2
      if (i >= trimmed.length || trimmed[i] === '[') {
        // `$..` のみ（キーなし）
        segments.push({ type: 'recursive', key: null })
      } else {
        // `$..key` の形式
        let key = ''
        while (i < trimmed.length && trimmed[i] !== '.' && trimmed[i] !== '[') {
          key += trimmed[i++]
        }
        segments.push({ type: 'recursive', key })
      }
      continue
    }

    // `.key` 形式
    if (trimmed[i] === '.') {
      i++
      if (i >= trimmed.length) break
      let key = ''
      while (i < trimmed.length && trimmed[i] !== '.' && trimmed[i] !== '[') {
        key += trimmed[i++]
      }
      if (key === '*') {
        segments.push({ type: 'wildcard' })
      } else if (key.length > 0) {
        segments.push({ type: 'key', key })
      }
      continue
    }

    // `[...]` 形式
    if (trimmed[i] === '[') {
      i++ // `[` をスキップ
      let inner = ''
      while (i < trimmed.length && trimmed[i] !== ']') {
        inner += trimmed[i++]
      }
      if (trimmed[i] !== ']') {
        return '括弧が閉じられていません'
      }
      i++ // `]` をスキップ

      if (inner === '*') {
        segments.push({ type: 'wildcard' })
      } else {
        const idx = parseInt(inner, 10)
        if (isNaN(idx)) {
          return `無効なインデックス: "${inner}"`
        }
        segments.push({ type: 'index', index: idx })
      }
      continue
    }

    return `予期しない文字: "${trimmed[i]}"`
  }

  return segments
}

/** 単一ノードにセグメントを適用して結果を収集する */
function applySegments(node: unknown, segments: Segment[]): unknown[] {
  if (segments.length === 0) return [node]

  const [seg, ...rest] = segments

  if (seg.type === 'key') {
    if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
      const obj = node as Record<string, unknown>
      if (Object.prototype.hasOwnProperty.call(obj, seg.key)) {
        return applySegments(obj[seg.key], rest)
      }
    }
    return []
  }

  if (seg.type === 'index') {
    if (Array.isArray(node)) {
      const idx = seg.index < 0 ? node.length + seg.index : seg.index
      if (idx >= 0 && idx < node.length) {
        return applySegments(node[idx], rest)
      }
    }
    return []
  }

  if (seg.type === 'wildcard') {
    if (Array.isArray(node)) {
      return node.flatMap(item => applySegments(item, rest))
    }
    if (node !== null && typeof node === 'object') {
      return Object.values(node as Record<string, unknown>).flatMap(v =>
        applySegments(v, rest)
      )
    }
    return []
  }

  if (seg.type === 'recursive') {
    const results: unknown[] = []
    // まず現在ノード自体に残りセグメントを適用（キーなし再帰の場合）
    if (seg.key === null) {
      results.push(...applySegments(node, rest))
    } else {
      // `$..key` — このノードが対象キーを持つなら収集
      if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
        const obj = node as Record<string, unknown>
        if (Object.prototype.hasOwnProperty.call(obj, seg.key)) {
          results.push(...applySegments(obj[seg.key], rest))
        }
      }
    }
    // すべての子ノードに再帰
    if (Array.isArray(node)) {
      for (const item of node) {
        results.push(...applySegments(item, segments))
      }
    } else if (node !== null && typeof node === 'object') {
      for (const val of Object.values(node as Record<string, unknown>)) {
        results.push(...applySegments(val, segments))
      }
    }
    return results
  }

  return []
}

/** JSONPath クエリを実行する */
export function queryJsonPath(json: string, path: string): QueryResult {
  if (json.trim() === '') {
    return { ok: false, error: 'JSONを入力してください' }
  }

  let root: unknown
  try {
    root = JSON.parse(json)
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { ok: false, error: `JSONの解析に失敗しました: ${msg}` }
  }

  if (path.trim() === '' || path.trim() === '$') {
    return { ok: true, results: [root], count: 1 }
  }

  const segments = parsePath(path)
  if (typeof segments === 'string') {
    return { ok: false, error: `パスの解析に失敗しました: ${segments}` }
  }

  const results = applySegments(root, segments)
  return { ok: true, results, count: results.length }
}
