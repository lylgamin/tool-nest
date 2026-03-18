'use client'

import { useState, useCallback } from 'react'

/** 単一テキストのクリップボードコピー用 hook */
export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      })
    },
    [timeout],
  )

  return { copied, copy }
}

/** 文字列キー付きコピー用 hook（カラーフォーマット名・フィールド名など文字列で識別する場合） */
export function useStringCopy(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copy = useCallback(
    (key: string, text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), timeout)
      })
    },
    [timeout],
  )

  return { copiedKey, copy }
}

/** インデックス付きコピー用 hook（一覧など複数ボタンが並ぶ場合） */
export function useIndexedCopy(timeout = 1500) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const copy = useCallback(
    (idx: number, text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), timeout)
      })
    },
    [timeout],
  )

  return { copiedIdx, copy }
}
