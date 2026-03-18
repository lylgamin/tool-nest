export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

export function generateJsonSchema(value: unknown, title?: string): object {
  const schema = buildSchema(value)
  if (title && typeof schema === 'object' && schema !== null) {
    return { $schema: 'http://json-schema.org/draft-07/schema#', title, ...schema }
  }
  return { $schema: 'http://json-schema.org/draft-07/schema#', ...schema as object }
}

function buildSchema(value: unknown): object {
  if (value === null) return { type: 'null' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
  }
  if (typeof value === 'string') return { type: 'string' }
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} }
    return { type: 'array', items: buildSchema(value[0]) }
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const properties: Record<string, object> = {}
    const required: string[] = []
    for (const [key, val] of Object.entries(obj)) {
      properties[key] = buildSchema(val)
      if (val !== null && val !== undefined) required.push(key)
    }
    const schema: Record<string, unknown> = { type: 'object', properties }
    if (required.length > 0) schema.required = required
    return schema
  }
  return {}
}

export function generateJsonSchemaFromString(input: string, title?: string): Result<string> {
  try {
    const parsed = JSON.parse(input)
    const schema = generateJsonSchema(parsed, title)
    return { ok: true, output: JSON.stringify(schema, null, 2) }
  } catch (e) {
    return { ok: false, error: `JSONパースエラー: ${(e as Error).message}` }
  }
}
