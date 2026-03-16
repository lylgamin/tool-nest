import { describe, it, expect } from 'vitest'
import { convertAllTimezones, parseToUnixMs } from '../utils'

describe('convertAllTimezones', () => {
  it('unixMs=0 → UTC 1970-01-01, JST 1970-01-01 09:00:00', () => {
    const results = convertAllTimezones(0)
    const utc = results.find(r => r.id === 'UTC')!
    const jst = results.find(r => r.id === 'JST')!
    expect(utc.formatted).toContain('1970-01-01')
    expect(utc.formatted).toContain('00:00:00')
    expect(jst.formatted).toContain('1970-01-01')
    expect(jst.formatted).toContain('09:00:00')
  })

  it('8つのタイムゾーン結果を返す', () => {
    const results = convertAllTimezones(0)
    expect(results).toHaveLength(8)
  })
})

describe('parseToUnixMs', () => {
  it('JST 2024-01-01 00:00:00 → UTC 2023-12-31 15:00:00', () => {
    const ms = parseToUnixMs('2024-01-01', '00:00:00', 'JST')
    const utcResults = convertAllTimezones(ms)
    const utc = utcResults.find(r => r.id === 'UTC')!
    expect(utc.formatted).toContain('2023-12-31')
    expect(utc.formatted).toContain('15:00:00')
  })

  it('UTC 1970-01-01 00:00:00 → unixMs=0', () => {
    const ms = parseToUnixMs('1970-01-01', '00:00:00', 'UTC')
    expect(ms).toBe(0)
  })
})

describe('round-trip', () => {
  it('JST → convert → JST でラウンドトリップする', () => {
    const ms = parseToUnixMs('2024-06-15', '12:30:00', 'JST')
    const results = convertAllTimezones(ms)
    const jst = results.find(r => r.id === 'JST')!
    expect(jst.formatted).toContain('2024-06-15')
    expect(jst.formatted).toContain('12:30:00')
  })
})
