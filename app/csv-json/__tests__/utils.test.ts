import { describe, it, expect } from 'vitest'
import { csvToJson, jsonToCsv, parseCsv } from '../utils'

describe('parseCsv', () => {
  it('基本的なCSVを解析', () => {
    const r = parseCsv('a,b,c\n1,2,3')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toHaveLength(2)
      expect(r.output[0]).toEqual(['a','b','c'])
      expect(r.output[1]).toEqual(['1','2','3'])
    }
  })

  it('クォートセルを解析', () => {
    const r = parseCsv('a,b\n"hello, world","foo"')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output[1][0]).toBe('hello, world')
  })

  it('空文字でエラー', () => {
    expect(parseCsv('').ok).toBe(false)
  })
})

describe('csvToJson', () => {
  it('CSV→JSON変換', () => {
    const r = csvToJson('id,name\n1,Alice\n2,Bob')
    expect(r.ok).toBe(true)
    if (r.ok) {
      const arr = JSON.parse(r.output)
      expect(arr).toHaveLength(2)
      expect(arr[0].name).toBe('Alice')
      expect(arr[0].id).toBe(1)
    }
  })

  it('数値を自動変換', () => {
    const r = csvToJson('x,y\n1.5,2')
    expect(r.ok).toBe(true)
    if (r.ok) {
      const arr = JSON.parse(r.output)
      expect(typeof arr[0].x).toBe('number')
    }
  })
})

describe('jsonToCsv', () => {
  it('JSON→CSV変換', () => {
    const r = jsonToCsv('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('id,name')
      expect(r.output).toContain('Alice')
    }
  })

  it('カンマを含む値をクォート', () => {
    const r = jsonToCsv('[{"a":"hello, world"}]')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('"hello, world"')
  })

  it('配列でないJSONでエラー', () => {
    const r = jsonToCsv('{"key":"value"}')
    expect(r.ok).toBe(false)
  })

  it('不正なJSONでエラー', () => {
    const r = jsonToCsv('{invalid}')
    expect(r.ok).toBe(false)
  })
})
