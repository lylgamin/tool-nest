export type PasswordOptions = {
  length: number       // 8〜64
  uppercase: boolean   // A-Z
  lowercase: boolean   // a-z
  numbers: boolean     // 0-9
  symbols: boolean     // !@#$%^&*()-_=+[]{}|;:,.<>?
}

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

export function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options
  const pools: string[] = []
  if (uppercase) pools.push(CHARSET.uppercase)
  if (lowercase) pools.push(CHARSET.lowercase)
  if (numbers)   pools.push(CHARSET.numbers)
  if (symbols)   pools.push(CHARSET.symbols)
  if (pools.length === 0) return ''

  const fullPool = pools.join('')
  const result: string[] = []

  // 各プールから最低1文字
  for (const pool of pools) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    result.push(pool[arr[0] % pool.length])
  }

  // 残りをランダム選択
  const remaining = length - result.length
  for (let i = 0; i < remaining; i++) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    result.push(fullPool[arr[0] % fullPool.length])
  }

  // シャッフル（Fisher-Yates）
  for (let i = result.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    const j = arr[0] % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result.join('')
}

export function calcEntropy(options: PasswordOptions): number {
  const { length, uppercase, lowercase, numbers, symbols } = options
  let poolSize = 0
  if (uppercase) poolSize += CHARSET.uppercase.length
  if (lowercase) poolSize += CHARSET.lowercase.length
  if (numbers)   poolSize += CHARSET.numbers.length
  if (symbols)   poolSize += CHARSET.symbols.length
  if (poolSize === 0) return 0
  return length * Math.log2(poolSize)
}

export type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'

export function getStrengthLevel(entropy: number): StrengthLevel {
  if (entropy < 28)  return 'very-weak'
  if (entropy < 36)  return 'weak'
  if (entropy < 60)  return 'fair'
  if (entropy < 128) return 'strong'
  return 'very-strong'
}

export function getStrengthLabel(level: StrengthLevel): string {
  switch (level) {
    case 'very-weak':   return '非常に弱い'
    case 'weak':        return '弱い'
    case 'fair':        return '普通'
    case 'strong':      return '強い'
    case 'very-strong': return '非常に強い'
  }
}
