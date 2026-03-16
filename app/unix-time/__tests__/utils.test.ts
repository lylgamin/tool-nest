import { describe, it, expect } from 'vitest'
import { fromUnix, toUnix } from '../utils'

describe('fromUnix', () => {
  it('unix=0 → UNIX epoch', () => {
    const r = fromUnix(0)
    expect(r.unix).toBe(0)
    expect(r.unixMs).toBe(0)
    expect(r.iso).toBe('1970-01-01T00:00:00.000Z')
    expect(r.utc).toBe('1970-01-01 00:00:00')
    expect(r.jst).toBe('1970-01-01 09:00:00')
  })

  it('unix=1704067200 → 2024-01-01 09:00:00 JST', () => {
    const r = fromUnix(1704067200)
    expect(r.jst).toBe('2024-01-01 09:00:00')
    expect(r.utc).toBe('2024-01-01 00:00:00')
  })
})

describe('toUnix', () => {
  it('JST 2024-01-01 00:00:00 → unix', () => {
    const unix = toUnix('2024-01-01', '00:00:00', 9)
    expect(unix).toBe(1704034800)
  })

  it('UTC 1970-01-01 00:00:00 → 0', () => {
    expect(toUnix('1970-01-01', '00:00:00', 0)).toBe(0)
  })
})

describe('round-trip', () => {
  it('fromUnix(toUnix(...)) はラウンドトリップする', () => {
    const unix = toUnix('2024-06-15', '12:30:00', 9)
    const result = fromUnix(unix)
    expect(result.unix).toBe(unix)
    expect(result.jst).toBe('2024-06-15 12:30:00')
  })
})
