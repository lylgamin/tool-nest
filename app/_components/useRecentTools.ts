'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tool_nest_recent'
const MAX_ITEMS = 6

/**
 * 最近使ったツールを LocalStorage で管理する hook。
 * ツールページでマウント時に recordRecentTool(id) を呼ぶことで記録される。
 */
export function useRecentTools() {
  const [recentIds, setRecentIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setRecentIds(JSON.parse(saved) as string[])
    } catch {}
  }, [])

  return recentIds
}

/**
 * ツールページのマウント時に呼ぶ。
 * 先頭に追加し、重複除去・上限 MAX_ITEMS を維持する。
 */
export function recordRecentTool(id: string) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const current: string[] = saved ? (JSON.parse(saved) as string[]) : []
    const deduped = [id, ...current.filter((x) => x !== id)].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped))
  } catch {}
}
