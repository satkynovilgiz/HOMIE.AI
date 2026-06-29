import { useEffect, useState } from 'react'

export default function Toast({ msg, color = 'var(--purple)' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => setVisible(false), 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
      background: 'var(--bg3)', border: `1px solid ${color}`,
      borderRadius: 30, padding: '10px 24px',
      fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)',
      color: 'var(--text)', zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: `0 4px 20px rgba(0,0,0,.4), 0 0 20px ${color}40`,
      pointerEvents: 'none',
    }}>
      {msg}
    </div>
  )
}
