import { describe, it, expect } from 'vitest'
import { convertCurl, parseCurl } from '../utils'

describe('parseCurl', () => {
  it('基本GETリクエスト', () => {
    const r = parseCurl('curl https://api.example.com/users')
    expect(r.url).toBe('https://api.example.com/users')
    expect(r.method).toBe('GET')
  })

  it('-X POSTでPOSTメソッド', () => {
    const r = parseCurl('curl -X POST https://api.example.com/users')
    expect(r.method).toBe('POST')
  })

  it('-Hでヘッダーを解析', () => {
    const r = parseCurl('curl -H "Content-Type: application/json" https://api.example.com')
    expect(r.headers['Content-Type']).toBe('application/json')
  })

  it('-dでボディを解析', () => {
    const r = parseCurl("curl -X POST -d '{\"name\":\"Alice\"}' https://api.example.com/users")
    expect(r.body).toBe('{"name":"Alice"}')
  })

  it('ボディがあればPOSTを推測', () => {
    const r = parseCurl("curl -d 'data=value' https://api.example.com")
    expect(r.method).toBe('POST')
  })
})

describe('convertCurl', () => {
  it('fetch形式に変換', () => {
    const r = convertCurl('curl https://api.example.com/users', 'fetch')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('fetch(')
      expect(r.output).toContain('api.example.com')
    }
  })

  it('axios形式に変換', () => {
    const r = convertCurl('curl https://api.example.com/users', 'axios')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('axios.')
  })

  it('python形式に変換', () => {
    const r = convertCurl('curl https://api.example.com/users', 'python')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('requests.')
      expect(r.output).toContain('import requests')
    }
  })

  it('空文字でエラー', () => {
    expect(convertCurl('', 'fetch').ok).toBe(false)
  })

  it('curl以外の入力でエラー', () => {
    expect(convertCurl('wget https://example.com', 'fetch').ok).toBe(false)
  })

  it('ヘッダーがfetch出力に含まれる', () => {
    const r = convertCurl('curl -H "Authorization: Bearer token123" https://api.example.com', 'fetch')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('Authorization')
      expect(r.output).toContain('token123')
    }
  })
})
