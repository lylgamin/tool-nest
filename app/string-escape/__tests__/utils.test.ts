import { describe, it, expect } from 'vitest'
import { escapeString, unescapeString } from '../utils'

describe('escapeString', () => {
  describe('js', () => {
    it('改行をエスケープする', () => {
      expect(escapeString('hello\nworld', 'js')).toBe('hello\\nworld')
    })

    it('タブをエスケープする', () => {
      expect(escapeString('a\tb', 'js')).toBe('a\\tb')
    })

    it('ダブルクォートをエスケープする', () => {
      expect(escapeString('say "hello"', 'js')).toBe('say \\"hello\\"')
    })

    it('バックスラッシュをエスケープする', () => {
      expect(escapeString('C:\\Users\\name', 'js')).toBe('C:\\\\Users\\\\name')
    })

    it('複数の特殊文字を同時にエスケープする', () => {
      expect(escapeString('line1\nline2\t"end"', 'js')).toBe('line1\\nline2\\t\\"end\\"')
    })

    it('特殊文字なしの場合はそのまま返す', () => {
      expect(escapeString('hello world', 'js')).toBe('hello world')
    })
  })

  describe('json', () => {
    it('JSON.stringify相当のエスケープをする', () => {
      expect(escapeString('hello\nworld', 'json')).toBe('hello\\nworld')
    })

    it('ダブルクォートをエスケープする', () => {
      expect(escapeString('say "hello"', 'json')).toBe('say \\"hello\\"')
    })

    it('バックスラッシュをエスケープする', () => {
      expect(escapeString('a\\b', 'json')).toBe('a\\\\b')
    })

    it('タブをエスケープする', () => {
      expect(escapeString('\t', 'json')).toBe('\\t')
    })
  })

  describe('python', () => {
    it('シングルクォートをエスケープする', () => {
      expect(escapeString("it's fine", 'python')).toBe("it\\'s fine")
    })

    it('バックスラッシュをエスケープする', () => {
      expect(escapeString('C:\\path', 'python')).toBe('C:\\\\path')
    })

    it('改行をエスケープする', () => {
      expect(escapeString('line1\nline2', 'python')).toBe('line1\\nline2')
    })

    it('タブをエスケープする', () => {
      expect(escapeString('col1\tcol2', 'python')).toBe('col1\\tcol2')
    })
  })

  describe('sql', () => {
    it("シングルクォートを '' にエスケープする", () => {
      expect(escapeString("O'Brien", 'sql')).toBe("O''Brien")
    })

    it('複数のシングルクォートをエスケープする', () => {
      expect(escapeString("it's a dog's life", 'sql')).toBe("it''s a dog''s life")
    })

    it('特殊文字なしの場合はそのまま返す', () => {
      expect(escapeString('hello world', 'sql')).toBe('hello world')
    })
  })
})

describe('unescapeString', () => {
  describe('js', () => {
    it('\\n をアンエスケープする', () => {
      const result = unescapeString('hello\\nworld', 'js')
      expect(result).toEqual({ ok: true, output: 'hello\nworld' })
    })

    it('\\t をアンエスケープする', () => {
      const result = unescapeString('a\\tb', 'js')
      expect(result).toEqual({ ok: true, output: 'a\tb' })
    })

    it('\\" をアンエスケープする', () => {
      const result = unescapeString('say \\"hello\\"', 'js')
      expect(result).toEqual({ ok: true, output: 'say "hello"' })
    })

    it('\\\\ をアンエスケープする', () => {
      const result = unescapeString('C:\\\\Users\\\\name', 'js')
      expect(result).toEqual({ ok: true, output: 'C:\\Users\\name' })
    })

    it('不正な入力はエラーを返す', () => {
      const result = unescapeString('\\x{invalid}', 'js')
      expect(result.ok).toBe(false)
    })
  })

  describe('json', () => {
    it('\\n をアンエスケープする', () => {
      const result = unescapeString('hello\\nworld', 'json')
      expect(result).toEqual({ ok: true, output: 'hello\nworld' })
    })

    it('\\\\ をアンエスケープする', () => {
      const result = unescapeString('a\\\\b', 'json')
      expect(result).toEqual({ ok: true, output: 'a\\b' })
    })
  })

  describe('python', () => {
    it("\\' をアンエスケープする", () => {
      const result = unescapeString("it\\'s fine", 'python')
      expect(result).toEqual({ ok: true, output: "it's fine" })
    })

    it('\\\\ をアンエスケープする', () => {
      const result = unescapeString('C:\\\\path', 'python')
      expect(result).toEqual({ ok: true, output: 'C:\\path' })
    })

    it('\\n をアンエスケープする', () => {
      const result = unescapeString('line1\\nline2', 'python')
      expect(result).toEqual({ ok: true, output: 'line1\nline2' })
    })

    it('\\t をアンエスケープする', () => {
      const result = unescapeString('col1\\tcol2', 'python')
      expect(result).toEqual({ ok: true, output: 'col1\tcol2' })
    })
  })

  describe('sql', () => {
    it("'' をアンエスケープする", () => {
      const result = unescapeString("O''Brien", 'sql')
      expect(result).toEqual({ ok: true, output: "O'Brien" })
    })

    it('複数の連続クォートをアンエスケープする', () => {
      const result = unescapeString("it''s a dog''s life", 'sql')
      expect(result).toEqual({ ok: true, output: "it's a dog's life" })
    })
  })

  describe('ラウンドトリップ（エスケープ → アンエスケープ）', () => {
    it('js: 元の文字列に戻る', () => {
      const original = 'hello\nworld\t"end"\\'
      const escaped = escapeString(original, 'js')
      const result = unescapeString(escaped, 'js')
      expect(result).toEqual({ ok: true, output: original })
    })

    it('python: 元の文字列に戻る', () => {
      const original = "it's a\nnew\\line"
      const escaped = escapeString(original, 'python')
      const result = unescapeString(escaped, 'python')
      expect(result).toEqual({ ok: true, output: original })
    })

    it('sql: 元の文字列に戻る', () => {
      const original = "O'Brien's dog"
      const escaped = escapeString(original, 'sql')
      const result = unescapeString(escaped, 'sql')
      expect(result).toEqual({ ok: true, output: original })
    })
  })
})
