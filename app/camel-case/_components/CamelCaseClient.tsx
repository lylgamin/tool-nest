'use client';

import { useState } from 'react';
import { toCamelCase, toPascalCase } from '../utils';

type Tab = 'camel' | 'pascal';

export default function CamelCaseClient() {
  const [tab, setTab] = useState<Tab>('camel');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const output = tab === 'camel' ? toCamelCase(input) : toPascalCase(input);

  function handleCopy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleClear() {
    setInput('');
    setCopied(false);
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'var(--font-jetbrains)',
    color: active ? 'var(--teal)' : 'var(--ink-mid)',
    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
    fontWeight: active ? 500 : 400,
    transition: 'color 0.15s, border-color 0.15s',
  });

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      {/* タブ */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 4px' }}>
        <button style={tabStyle(tab === 'camel')} onClick={() => setTab('camel')}>
          camelCase
        </button>
        <button style={tabStyle(tab === 'pascal')} onClick={() => setTab('pascal')}>
          PascalCase
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* 入力 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-jetbrains)', color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: '6px' }}>
            INPUT
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'foo_bar_baz\nfoo-bar-baz\nFoo Bar Baz'}
            rows={4}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--surface-alt)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        {/* 出力 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-jetbrains)', color: 'var(--ink-light)', letterSpacing: '0.08em', marginBottom: '6px' }}>
            OUTPUT
          </label>
          <input
            readOnly
            value={output}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              border: '1px solid var(--border-light)',
              borderRadius: '6px',
              background: '#f5f3f0',
              color: 'var(--ink)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>

        {/* ボタン */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopy}
            disabled={!output}
            style={{
              padding: '8px 20px',
              background: copied ? 'var(--teal)' : 'var(--navy)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-noto-sans)',
              fontSize: '13px',
              cursor: output ? 'pointer' : 'not-allowed',
              opacity: output ? 1 : 0.5,
              transition: 'background 0.15s',
            }}
          >
            {copied ? 'コピーしました！' : 'コピー'}
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              background: 'none',
              color: 'var(--ink-mid)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontFamily: 'var(--font-noto-sans)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}
