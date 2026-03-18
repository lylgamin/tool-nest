'use client'

import { useState, useRef, useCallback } from 'react'
import { formatDataUri, estimateSizeKb, extractBase64FromDataUri } from '../utils'

type OutputMode = 'dataUri' | 'base64Only'

interface ImageInfo {
  fileName: string
  fileSize: number
  mimeType: string
  dataUri: string
}

export default function ImageToBase64Tool() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [outputMode, setOutputMode] = useState<OutputMode>('dataUri')
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUri = e.target?.result as string
      if (!dataUri) {
        setError('ファイルの読み込みに失敗しました。')
        return
      }
      setImageInfo({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        dataUri,
      })
      setCopied(false)
    }
    reader.onerror = () => {
      setError('ファイルの読み込み中にエラーが発生しました。')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const outputValue = imageInfo
    ? outputMode === 'dataUri'
      ? imageInfo.dataUri
      : (extractBase64FromDataUri(imageInfo.dataUri)?.base64 ?? '')
    : ''

  const handleCopy = () => {
    if (!outputValue) return
    navigator.clipboard.writeText(outputValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setImageInfo(null)
    setCopied(false)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const base64Data = imageInfo ? (extractBase64FromDataUri(imageInfo.dataUri)?.base64 ?? '') : ''
  const estimatedKb = base64Data ? estimateSizeKb(base64Data) : 0

  return (
    <div>
      {/* ドロップゾーン */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${isDragging ? 'var(--teal)' : 'var(--border)'}`,
          borderRadius: '6px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? 'var(--teal-mid)' : 'var(--surface)',
          transition: 'border-color 0.15s, background-color 0.15s',
          marginBottom: '1.5rem',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: isDragging ? 'var(--teal)' : 'var(--ink-mid)',
          marginBottom: '6px',
        }}>
          画像をドラッグ＆ドロップ、またはクリックして選択
        </div>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: 'var(--ink-light)',
        }}>
          PNG / JPEG / GIF / WebP / SVG / BMP
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(180,40,40,0.07)',
          border: '1px solid rgba(180,40,40,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b42828',
        }}>
          {error}
        </div>
      )}

      {imageInfo && (
        <>
          {/* ファイル情報 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            {[
              { label: 'ファイル名', value: imageInfo.fileName },
              { label: 'ファイルサイズ', value: `${(imageInfo.fileSize / 1024).toFixed(1)} KB` },
              { label: 'MIMEタイプ', value: imageInfo.mimeType },
              { label: 'Base64サイズ（推定）', value: `${estimatedKb} KB` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '6px 12px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'var(--ink-light)',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  wordBreak: 'break-all',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* プレビュー */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              プレビュー
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageInfo.dataUri}
              alt={imageInfo.fileName}
              style={{
                maxWidth: '100%',
                maxHeight: '240px',
                objectFit: 'contain',
                borderRadius: '4px',
                border: '1px solid var(--border-light)',
                display: 'block',
                backgroundColor: 'var(--surface-alt)',
              }}
            />
          </div>

          {/* 出力モード切替 */}
          <div style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1rem',
          }}>
            {([
              { key: 'dataUri', label: 'Data URI形式' },
              { key: 'base64Only', label: 'Base64のみ' },
            ] as { key: OutputMode; label: string }[]).map(({ key, label }) => {
              const active = outputMode === key
              return (
                <button
                  key={key}
                  onClick={() => { setOutputMode(key); setCopied(false) }}
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    padding: '8px 20px',
                    border: 'none',
                    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                    background: 'none',
                    color: active ? 'var(--teal)' : 'var(--ink-light)',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                    transition: 'color 0.15s',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* 出力エリア */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--ink-light)',
                textTransform: 'uppercase',
              }}>
                {outputMode === 'dataUri' ? 'Data URI 出力' : 'Base64 出力'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: copied ? 'var(--teal)' : 'var(--ink-light)',
                    background: 'none',
                    border: '1px solid var(--border-light)',
                    borderRadius: '3px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                >
                  {copied ? 'コピー済み ✓' : 'コピー'}
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--ink-light)',
                    background: 'none',
                    border: '1px solid var(--border-light)',
                    borderRadius: '3px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  クリア
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={outputValue}
              rows={6}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                color: 'var(--ink)',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.65,
                boxSizing: 'border-box',
                cursor: 'default',
                wordBreak: 'break-all',
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
