export type SemVer = { major: number; minor: number; patch: number; pre?: string }

export function parseSemVer(v: string): SemVer | null {
  const match = v.trim().replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.\-]+))?$/)
  if (!match) return null
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    pre: match[4],
  }
}

function comparePreRelease(a?: string, b?: string): -1 | 0 | 1 {
  if (!a && !b) return 0
  if (!a) return 1  // no pre-release > has pre-release
  if (!b) return -1
  return a < b ? -1 : a > b ? 1 : 0
}

export function compareSemVer(a: string, b: string): -1 | 0 | 1 {
  const pa = parseSemVer(a)
  const pb = parseSemVer(b)
  if (!pa || !pb) return 0
  if (pa.major !== pb.major) return pa.major < pb.major ? -1 : 1
  if (pa.minor !== pb.minor) return pa.minor < pb.minor ? -1 : 1
  if (pa.patch !== pb.patch) return pa.patch < pb.patch ? -1 : 1
  return comparePreRelease(pa.pre, pb.pre)
}

export function bumpVersion(v: string, type: 'major' | 'minor' | 'patch'): string {
  const parsed = parseSemVer(v)
  if (!parsed) return v
  const { major, minor, patch } = parsed
  switch (type) {
    case 'major': return `${major + 1}.0.0`
    case 'minor': return `${major}.${minor + 1}.0`
    case 'patch': return `${major}.${minor}.${patch + 1}`
  }
}

export function satisfiesRange(version: string, range: string): boolean {
  const v = parseSemVer(version)
  if (!v) return false
  const trimmedRange = range.trim()

  // ^x.y.z: >=x.y.z <(x+1).0.0
  const caretMatch = trimmedRange.match(/^\^(.+)$/)
  if (caretMatch) {
    const min = parseSemVer(caretMatch[1])
    if (!min) return false
    const cmp = compareSemVer(version, caretMatch[1])
    if (cmp < 0) return false
    return v.major === min.major
  }

  // ~x.y.z: >=x.y.z <x.(y+1).0
  const tildeMatch = trimmedRange.match(/^~(.+)$/)
  if (tildeMatch) {
    const min = parseSemVer(tildeMatch[1])
    if (!min) return false
    const cmp = compareSemVer(version, tildeMatch[1])
    if (cmp < 0) return false
    return v.major === min.major && v.minor === min.minor
  }

  // >=, >, <=, <, =
  const opMatch = trimmedRange.match(/^(>=|>|<=|<|=)(.+)$/)
  if (opMatch) {
    const op = opMatch[1]
    const cmp = compareSemVer(version, opMatch[2].trim())
    switch (op) {
      case '>=': return cmp >= 0
      case '>': return cmp > 0
      case '<=': return cmp <= 0
      case '<': return cmp < 0
      case '=': return cmp === 0
    }
  }

  // exact match
  return compareSemVer(version, trimmedRange) === 0
}
