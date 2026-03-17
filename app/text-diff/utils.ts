export type DiffKind = 'equal' | 'added' | 'removed'

export interface DiffLine {
  kind: DiffKind
  lineOld: number | null  // 元テキストでの行番号（1始まり）
  lineNew: number | null  // 新テキストでの行番号（1始まり）
  content: string
}

/**
 * LCS（最長共通部分列）アルゴリズムを使った行単位の差分計算
 * 外部ライブラリ不使用、標準JSのみで実装
 */
export function diffLines(oldText: string, newText: string): DiffLine[] {
  if (oldText === '' && newText === '') return []

  const oldLines = oldText === '' ? [] : oldText.split('\n')
  const newLines = newText === '' ? [] : newText.split('\n')

  const m = oldLines.length
  const n = newLines.length

  // LCS テーブルを構築（DPで O(m*n) 計算）
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // バックトラックで差分を生成
  const result: DiffLine[] = []
  let i = m
  let j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.push({ kind: 'equal', lineOld: i, lineNew: j, content: oldLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ kind: 'added', lineOld: null, lineNew: j, content: newLines[j - 1] })
      j--
    } else {
      result.push({ kind: 'removed', lineOld: i, lineNew: null, content: oldLines[i - 1] })
      i--
    }
  }

  return result.reverse()
}
