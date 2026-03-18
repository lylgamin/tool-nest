import { describe, it, expect } from 'vitest'
import { generateJsonSchema, generateJsonSchemaFromString } from '../utils'

describe('generateJsonSchema', () => {
  it('null を type: null にマップする', () => {
    const schema = generateJsonSchema(null) as Record<string, unknown>
    expect(schema.type).toBe('null')
  })

  it('boolean を type: boolean にマップする', () => {
    const schema = generateJsonSchema(true) as Record<string, unknown>
    expect(schema.type).toBe('boolean')
  })

  it('整数を type: integer にマップする', () => {
    const schema = generateJsonSchema(42) as Record<string, unknown>
    expect(schema.type).toBe('integer')
  })

  it('浮動小数点数を type: number にマップする', () => {
    const schema = generateJsonSchema(3.14) as Record<string, unknown>
    expect(schema.type).toBe('number')
  })

  it('文字列を type: string にマップする', () => {
    const schema = generateJsonSchema('hello') as Record<string, unknown>
    expect(schema.type).toBe('string')
  })

  it('空配列を type: array かつ items: {} にマップする', () => {
    const schema = generateJsonSchema([]) as Record<string, unknown>
    expect(schema.type).toBe('array')
    expect(schema.items).toEqual({})
  })

  it('配列を type: array かつ要素のスキーマを items にマップする', () => {
    const schema = generateJsonSchema([1, 2, 3]) as Record<string, unknown>
    expect(schema.type).toBe('array')
    expect((schema.items as Record<string, unknown>).type).toBe('integer')
  })

  it('オブジェクトを type: object かつ properties と required にマップする', () => {
    const input = { name: 'Alice', age: 30 }
    const schema = generateJsonSchema(input) as Record<string, unknown>
    expect(schema.type).toBe('object')
    const props = schema.properties as Record<string, Record<string, unknown>>
    expect(props.name.type).toBe('string')
    expect(props.age.type).toBe('integer')
    expect(schema.required).toContain('name')
    expect(schema.required).toContain('age')
  })

  it('null 値のプロパティは required に含めない', () => {
    const input = { name: 'Alice', nickname: null }
    const schema = generateJsonSchema(input) as Record<string, unknown>
    const required = schema.required as string[]
    expect(required).toContain('name')
    expect(required).not.toContain('nickname')
  })

  it('$schema フィールドを出力に含める', () => {
    const schema = generateJsonSchema({ id: 1 }) as Record<string, unknown>
    expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#')
  })

  it('title を指定すると出力に含める', () => {
    const schema = generateJsonSchema({ id: 1 }, 'User') as Record<string, unknown>
    expect(schema.title).toBe('User')
  })
})

describe('generateJsonSchemaFromString', () => {
  it('有効なJSONからスキーマ文字列を生成する', () => {
    const result = generateJsonSchemaFromString('{"name": "Alice", "age": 30}')
    expect(result.ok).toBe(true)
    if (result.ok) {
      const parsed = JSON.parse(result.output)
      expect(parsed.type).toBe('object')
      expect(parsed.properties.name.type).toBe('string')
      expect(parsed.properties.age.type).toBe('integer')
    }
  })

  it('不正なJSONに対して error を返す', () => {
    const result = generateJsonSchemaFromString('{invalid json}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/JSONパースエラー/)
    }
  })

  it('title オプションをスキーマに反映する', () => {
    const result = generateJsonSchemaFromString('{"id": 1}', 'MySchema')
    expect(result.ok).toBe(true)
    if (result.ok) {
      const parsed = JSON.parse(result.output)
      expect(parsed.title).toBe('MySchema')
    }
  })
})
