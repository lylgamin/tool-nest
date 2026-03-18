'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * URL クエリパラメータと React state を同期する hook。
 * - router.replace を使うため「戻る」履歴を汚さない
 * - 静的エクスポート (output: "export") 対応。useSearchParams を使うため
 *   呼び出し元コンポーネントは Suspense でラップすること。
 */
export function useQueryState(key: string, defaultValue = '') {
  const searchParams = useSearchParams()
  const router = useRouter()

  const value = searchParams.get(key) ?? defaultValue

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (newValue === '' || newValue === defaultValue) {
        params.delete(key)
      } else {
        params.set(key, newValue)
      }
      const query = params.toString()
      router.replace(query ? `?${query}` : location.pathname, { scroll: false })
    },
    [searchParams, router, key, defaultValue],
  )

  return [value, setValue] as const
}
