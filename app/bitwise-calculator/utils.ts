export type BitwiseOp = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'

export function bitwiseCalc(op: BitwiseOp, a: number, b: number): number {
  switch (op) {
    case 'AND': return (a & b) >>> 0
    case 'OR': return (a | b) >>> 0
    case 'XOR': return (a ^ b) >>> 0
    case 'NOT': return (~a) >>> 0
    case 'LSHIFT': return (a << b) >>> 0
    case 'RSHIFT': return (a >>> b)
  }
}

export function toBinaryStr(n: number, bits: 8 | 16 | 32 = 32): string {
  const unsigned = n >>> 0
  return unsigned.toString(2).padStart(bits, '0')
}

export function toHexStr(n: number): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

export function parseIntInput(s: string, base: 2 | 8 | 10 | 16): number | null {
  const trimmed = s.trim()
  if (!trimmed) return null
  const n = parseInt(trimmed, base)
  if (isNaN(n)) return null
  return n >>> 0
}
