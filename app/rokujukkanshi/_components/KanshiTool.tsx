'use client'

import { useState } from 'react'
import { getKanshi, getAllKanshi } from '../utils'

export default function KanshiTool() {
  const [year, setYear] = useState(2025)

  const result = getKanshi(year)
  const all = getAllKanshi()

  return (
    <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
      {/* 入力 */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '14px', color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>
          西暦
        </label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{ width: '120px', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '15px', color: 'var(--ink)', backgroundColor: 'var(--surface-alt)', outline: 'none' }}
        />
        <span style={{ fontSize: '14px', color: 'var(--ink-mid)' }}>年</span>
        <button
          onClick={() => setYear(new Date().getFullYear())}
          style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--surface)', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', cursor: 'pointer' }}
        >
          今年
        </button>
      </div>

      {/* 結果 */}
      <div style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 500, color: 'var(--navy)', textAlign: 'center', lineHeight: 1 }}>
          {result.kanshi}
        </div>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '16px', color: 'var(--ink-mid)', marginTop: '0.5rem' }}>
          {result.yomi}
        </div>
      </div>

      {/* 詳細 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: '天干', value: result.stem, sub: result.stemYomi },
          { label: '地支', value: result.branch, sub: result.branchYomi },
          { label: '六十干支', value: `第${result.cycleIndex}番`, sub: '/ 60' },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.75rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-faint)', letterSpacing: '0.05em', marginBottom: '4px', fontFamily: 'var(--font-jetbrains), monospace' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'var(--font-noto-serif), serif' }}>{value}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-light)', marginTop: '2px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* 全一覧 折りたたみ */}
      <details style={{ border: '1px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
        <summary style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', backgroundColor: 'var(--surface)', userSelect: 'none' }}>
          六十干支 全一覧を表示
        </summary>
        <div style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
            <thead>
              <tr>
                {['番', '干支', '読み'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--border-light)', color: 'var(--ink-light)', fontWeight: 400, letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.map(item => (
                <tr key={item.cycleIndex} style={{ backgroundColor: item.kanshi === result.kanshi ? 'var(--navy-light)' : 'transparent' }}>
                  <td style={{ padding: '3px 8px', color: 'var(--ink-faint)', width: '3rem' }}>{item.cycleIndex}</td>
                  <td style={{ padding: '3px 8px', color: 'var(--ink)', fontWeight: item.kanshi === result.kanshi ? 500 : 400, fontFamily: 'var(--font-noto-serif), serif', fontSize: '14px' }}>{item.kanshi}</td>
                  <td style={{ padding: '3px 8px', color: 'var(--ink-mid)' }}>{item.yomi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
