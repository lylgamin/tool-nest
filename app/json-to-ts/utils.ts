export type GenerateResult = { ok: true; output: string } | { ok: false; error: string }

type JsonPrimitive = string | number | boolean | null
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[]
type JsonValue = JsonPrimitive | JsonObject | JsonArray

function isRecord(v: JsonValue): v is Record<string, JsonValue> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Infer TypeScript type string for a JSON value */
function inferType(value: JsonValue, indent: string, depth: number, rootName: string, interfaces: Map<string, string>): string {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
  if (typeof value === 'string') return 'string'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    // Get union of element types
    const elementTypes = value.map(v => inferType(v, indent, depth + 1, rootName, interfaces))
    const unique = [...new Set(elementTypes)]
    const inner = unique.length === 1 ? unique[0] : `(${unique.join(' | ')})`
    return `${inner}[]`
  }

  if (isRecord(value)) {
    // Generate interface for nested objects
    const entries = Object.entries(value)
    const lines = entries.map(([k, v]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`
      const isOptional = v === null
      const typeStr = inferType(v, indent, depth + 1, rootName, interfaces)
      return `${indent.repeat(depth + 1)}${safeKey}${isOptional ? '?' : ''}: ${typeStr};`
    })
    return `{\n${lines.join('\n')}\n${indent.repeat(depth)}}`
  }

  return 'unknown'
}

export function generateTypes(json: string, rootName: string = 'Root', style: 'interface' | 'type' = 'interface'): GenerateResult {
  if (!json.trim()) return { ok: false, error: '入力が空です' }

  let parsed: JsonValue
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return { ok: false, error: `JSONの解析に失敗: ${e instanceof SyntaxError ? e.message : String(e)}` }
  }

  const indent = '  '
  const interfaces = new Map<string, string>()

  if (Array.isArray(parsed)) {
    // Root is array
    if (parsed.length === 0) {
      const decl = style === 'interface'
        ? `export interface ${rootName} {}\n\nexport type ${rootName}List = ${rootName}[]`
        : `export type ${rootName} = {}\n\nexport type ${rootName}List = ${rootName}[]`
      return { ok: true, output: decl }
    }
    const first = parsed[0]
    if (isRecord(first)) {
      const itemType = inferType(first, indent, 0, rootName, interfaces)
      const decl = style === 'interface'
        ? `export interface ${rootName} ${itemType}\n\nexport type ${rootName}List = ${rootName}[]`
        : `export type ${rootName} = ${itemType}\n\nexport type ${rootName}List = ${rootName}[]`
      return { ok: true, output: decl }
    }
    const elemType = inferType(first, indent, 0, rootName, interfaces)
    return { ok: true, output: `export type ${rootName}List = ${elemType}[]` }
  }

  if (isRecord(parsed)) {
    const typeStr = inferType(parsed, indent, 0, rootName, interfaces)
    const decl = style === 'interface'
      ? `export interface ${rootName} ${typeStr}`
      : `export type ${rootName} = ${typeStr}`
    return { ok: true, output: decl }
  }

  return { ok: true, output: `export type ${rootName} = ${inferType(parsed, indent, 0, rootName, interfaces)}` }
}
