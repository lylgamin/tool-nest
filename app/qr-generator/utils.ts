export type QrResult = { ok: true; svg: string } | { ok: false; error: string }

export async function generateQrSvg(text: string, size: number = 300): Promise<QrResult> {
  if (!text.trim()) return { ok: false, error: '入力が空です' }
  try {
    const QRCode = (await import('qrcode')).default
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: '#19161a', light: '#faf8f4' },
    })
    return { ok: true, svg }
  } catch (e) {
    return { ok: false, error: `QRコードの生成に失敗しました: ${String(e)}` }
  }
}

export async function generateQrDataUrl(text: string, size: number = 300): Promise<QrResult> {
  if (!text.trim()) return { ok: false, error: '入力が空です' }
  try {
    const QRCode = (await import('qrcode')).default
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: { dark: '#19161a', light: '#faf8f4' },
    })
    return { ok: true, svg: dataUrl }
  } catch (e) {
    return { ok: false, error: `QRコードの生成に失敗しました: ${String(e)}` }
  }
}

export function validateQrInput(text: string): string | null {
  if (!text.trim()) return '入力が空です'
  if (text.length > 2953) return `入力が長すぎます（最大2953バイト、現在: ${new TextEncoder().encode(text).length}バイト）`
  return null
}
