import { describe, it, expect } from 'vitest'
import { generateUuidV4, generateUuids, isValidUuid, getUuidVersion } from '../utils'

const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateUuidV4', () => {
  it('正しいUUIDv4形式を返す', () => {
    expect(UUID_V4_RE.test(generateUuidV4())).toBe(true)
  })

  it('呼び出すたびに異なる値を返す', () => {
    const a = generateUuidV4()
    const b = generateUuidV4()
    expect(a).not.toBe(b)
  })
})

describe('generateUuids', () => {
  it('5個の異なるUUIDを返す', () => {
    const uuids = generateUuids(5)
    expect(uuids).toHaveLength(5)
    const unique = new Set(uuids)
    expect(unique.size).toBe(5)
  })

  it('1個のUUIDを返す', () => {
    const uuids = generateUuids(1)
    expect(uuids).toHaveLength(1)
    expect(UUID_V4_RE.test(uuids[0])).toBe(true)
  })

  it('100個すべてがユニーク', () => {
    const uuids = generateUuids(100)
    expect(uuids).toHaveLength(100)
    const unique = new Set(uuids)
    expect(unique.size).toBe(100)
  })
})

describe('isValidUuid', () => {
  it('正しいUUIDv4でtrue', () => {
    expect(isValidUuid(generateUuidV4())).toBe(true)
  })

  it('不正な文字列でfalse', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false)
    expect(isValidUuid('')).toBe(false)
    expect(isValidUuid('00000000-0000-0000-0000-000000000000')).toBe(false)
  })

  it('大文字でもtrue（大文字小文字区別なし）', () => {
    const upper = generateUuidV4().toUpperCase()
    expect(isValidUuid(upper)).toBe(true)
  })
})

describe('getUuidVersion', () => {
  it('v4 UUIDで4を返す', () => {
    expect(getUuidVersion(generateUuidV4())).toBe(4)
  })

  it('不正な文字列でnullを返す', () => {
    expect(getUuidVersion('invalid')).toBeNull()
    expect(getUuidVersion('')).toBeNull()
  })
})
