// ── HOME PAGE ────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function HomePage() {
  const { user, xp, level, streak, correct } = useApp()
  const navigate = useNavigate()

  const cards = [
    { icon: '💬', title: 'AI Chat', sub: 'Ask anything, get it explained like a friend', path: '/chat', color: 'var(--purple)' },
    { icon: '🎤', title: 'Voice Mode', sub: 'Talk to HOMIE hands-free', path: '/voice', color: 'var(--orange)' },
    { icon: '🎥', title: 'Video Explainers', sub: 'Find the perfect YouTube video for any topic', path: '/videos', color: 'var(--green)' },
    { icon: '📚', title: 'My History', sub: 'Review your past study sessions', path: '/history', color: 'var(--blue)' },
  ]

  return (
    <div style={{ overflowY: 'auto', flex: 1, padding: '32px 24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 900, marginBottom: 8 }}>
          Yo {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 16 }}>Ready to get that A+? Let's go 🔥</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Level', val: level, icon: '⭐' },
          { label: 'Total XP', val: xp, icon: '💎' },
          { label: 'Streak', val: streak, icon: '🔥' },
          { label: 'Correct', val: correct, icon: '✅' },
        ].map(({ label, val, icon }) => (
          <div key={label} style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 16, padding: '18px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26,
              background: 'linear-gradient(135deg,var(--purple2),var(--green2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{val}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Nav cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 32 }}>
        {cards.map(({ icon, title, sub, path, color }) => (
          <div key={path} onClick={() => navigate(path)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 20, padding: 24, cursor: 'pointer', transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = '' }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* GitHub CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
        background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)',
        borderRadius: 16, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 24 }}>⭐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>Star HOMIE on GitHub</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Open source · Built by Ilgiz @ De Anza</div>
        </div>
        <button onClick={() => window.open('https://github.com/satkynovilgiz/HOMIE.AI', '_blank')} style={{
          padding: '8px 18px', background: 'var(--bg4)', border: '1px solid var(--border3)',
          borderRadius: 10, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-display)',
        }}>GitHub →</button>
      </div>
    </div>
  )
}
