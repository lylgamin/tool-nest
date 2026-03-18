export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

export type DiffEntry = {
  path: string
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  left?: unknown
  right?: unknown
}

function diffValues(left: unknown, right: unknown, path: string, result: DiffEntry[]): void {
  if (left === right) {
    result.push({ path, type: 'unchanged', left, right })
    return
  }

  if (
    typeof left === 'object' && left !== null &&
    typeof right === 'object' && right !== null &&
    !Array.isArray(left) && !Array.isArray(right)
  ) {
    const leftObj = left as Record<string, unknown>
    const rightObj = right as Record<string, unknown>
    const keys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key
      if (!(key in leftObj)) {
        result.push({ path: childPath, type: 'added', right: rightObj[key] })
      } else if (!(key in rightObj)) {
        result.push({ path: childPath, type: 'removed', left: leftObj[key] })
      } else {
        diffValues(leftObj[key], rightObj[key], childPath, result)
      }
    }
    return
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const len = Math.max(left.length, right.length)
    for (let i = 0; i < len; i++) {
      const childPath = `${path}[${i}]`
      if (i >= left.length) {
        result.push({ path: childPath, type: 'added', right: right[i] })
      } else if (i >= right.length) {
        result.push({ path: childPath, type: 'removed', left: left[i] })
      } else {
        diffValues(left[i], right[i], childPath, result)
      }
    }
    return
  }

  result.push({ path, type: 'changed', left, right })
}

export function diffJson(leftStr: string, rightStr: string): Result<DiffEntry[]> {
  try {
    const left = JSON.parse(leftStr)
    const right = JSON.parse(rightStr)
    const result: DiffEntry[] = []
    diffValues(left, right, '', result)
    return { ok: true, output: result }
  } catch (e) {
    return { ok: false, error: `JSONパースエラー: ${(e as Error).message}` }
  }
}
