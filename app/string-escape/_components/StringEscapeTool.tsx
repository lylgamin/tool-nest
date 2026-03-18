'use client'

import { useState, useCallback } from 'react'
import { escapeString, unescapeString, type Lang } from '../utils'
import { useCopy } from '../../_components/useCopy'

type Mode = 'escape' | 'unescape'

const LANG_LABELS: Record<Lang, string> = {
  js: 'JavaScript',
  json: 'JSON',
  python: 'Python',
  sql: 'SQL',
}

const LANGS: Lang[] = ['js', 'json', 'python', 'sql']

export default function StringEscapeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState<Lang>('js')
  const [mode, setMode] = useState<Mode>('escape')
  const [error, setError] = useState<string | null>(null)
  const { copied, copy } = useCopy()

  const handleConvert = useCallback(() => {
    setError(null)
    if (mode === 'escape') {
      setOutput(escapeString(input, lang))
    } else {
      const result = unescapeString(input, lang)
      if (result.ok) {
        setOutput(result.output)
      } else {
        setError(result.error)
        setOutput('')
      }
    }
  }, [input, lang, mode])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  return (
    <div>
      {/* 言語選択 + モード切り替え */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        alignItems: 'center',
      }}>
        {/* 言語選択 */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '5px 12px',
                borderRadius: '3px',
                border: lang === l ? '1px solid var(--teal)' : '1px solid var(--border)',
                backgroundColor: lang === l ? 'var(--teal-mid)' : 'var(--surface-alt)',
                color: lang === l ? 'var(--teal)' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>

        {/* 区切り */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }} />

        {/* モード切り替え */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['escape', 'unescape'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '5px 12px',
                borderRadius: '3px',
                border: mode === m ? '1px solid var(--navy)' : '1px solid var(--border)',
                backgroundColor: mode === m ? 'var(--navy-light)' : 'var(--surface-alt)',
                color: mode === m ? 'var(--navy)' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {m === 'escape' ? 'エスケープ' : 'アンエスケープ'}
            </button>
          ))}
        </div>
      </div>

      {/* 入力エリア */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>
          入力 / input
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'escape'
            ? 'エスケープしたい文字列を入力してください\n例: hello\nworld\t"end"'
            : 'アンエスケープしたい文字列を入力してください\n例: hello\\nworld\\t\\"end\\"'
          }
          rows={8}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.65,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={handleConvert}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '6px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--navy)',
            color: '#fff',
            transition: 'background 0.15s',
          }}
        >
          {mode === 'escape' ? 'エスケープ' : 'アンエスケープ'}
        </button>
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '6px 16px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-mid)',
            transition: 'background 0.15s',
          }}
        >
          クリア
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#c85050',
          backgroundColor: 'rgba(200,80,80,0.08)',
          border: '1px solid rgba(200,80,80,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* 出力エリア */}
      {output !== '' && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
            }}>
              出力 / output
            </label>
            <button
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                padding: '3px 10px',
                borderRadius: '3px',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                backgroundColor: copied ? 'rgba(31,107,114,0.1)' : 'var(--surface)',
                color: copied ? 'var(--teal)' : 'var(--ink-mid)',
                transition: 'all 0.15s',
              }}
            >
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
          </div>
          <pre style={{
            backgroundColor: '#111820',
            color: '#a8b8c8',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            lineHeight: 1.65,
            padding: '1rem 1.25rem',
            borderRadius: '4px',
            overflowX: 'auto',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {output}
          </pre>
        </div>
      )}

      {/* 初期状態のメッセージ */}
      {output === '' && !error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          文字列を入力して変換ボタンを押してください
        </div>
      )}
    </div>
  )
}
