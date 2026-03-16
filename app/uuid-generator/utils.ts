// UUIDv4の正規表現パターン
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// 汎用UUIDパターン（バージョン検出用）
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** UUIDv4を1つ生成（crypto.randomUUID() を使用） */
export function generateUuidV4(): string {
  return crypto.randomUUID()
}

/** 複数のUUIDv4を生成（count: 1〜100） */
export function generateUuids(count: number): string[] {
  const n = Math.max(1, Math.min(100, count))
  return Array.from({ length: n }, () => generateUuidV4())
}

/** UUID文字列の形式バリデーション（UUIDv4） */
export function isValidUuid(uuid: string): boolean {
  return UUID_V4_PATTERN.test(uuid)
}

/** UUIDのバージョンを取得 */
export function getUuidVersion(uuid: string): number | null {
  const match = uuid.match(UUID_PATTERN)
  if (!match) return null
  return parseInt(match[1], 16)
}
