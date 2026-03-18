export function formatDataUri(mimeType: string, base64Data: string): string {
  return `data:${mimeType};base64,${base64Data}`
}

export function estimateSizeKb(base64: string): number {
  // Base64は元データの約4/3倍のサイズ
  return Math.round((base64.length * 3) / 4 / 1024 * 10) / 10
}

export function getSupportedMimeTypes(): string[] {
  return ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/ico']
}

export function extractBase64FromDataUri(dataUri: string): { mimeType: string; base64: string } | null {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  return { mimeType: match[1], base64: match[2] }
}
