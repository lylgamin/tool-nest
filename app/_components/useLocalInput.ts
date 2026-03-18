'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * LocalStorage に入力値を永続化する hook。
 * リロード後も直前の入力が復元される。
 *
 * @param key - ツールを識別するキー（例: 'json-formatter'）。`tool_nest_input_${key}` で保存される
 * @param defaultValue - 初期値（LocalStorage に値がない場合）
 */
export function useLocalInput(key: string, defaultValue = '') {
  const storageKey = `tool_nest_input_${key}`
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved !== null) setValue(saved)
    } catch {}
  }, [storageKey])

  const set = useCallback(
    (v: string) => {
      setValue(v)
      try {
        localStorage.setItem(storageKey, v)
      } catch {}
    },
    [storageKey],
  )

  const clear = useCallback(() => {
    setValue(defaultValue)
    try {
      localStorage.removeItem(storageKey)
    } catch {}
  }, [storageKey, defaultValue])

  return [value, set, clear] as const
}
