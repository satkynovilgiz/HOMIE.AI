import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { MessageSquare, Mic, Video, BookOpen, Home, User, LogOut } from 'lucide-react'

const links = [
  { to: '/home',    icon: Home,          label: 'Home'    },
  { to: '/chat',    icon: MessageSquare, label: 'Chat'    },
  { to: '/voice',   icon: Mic,           label: 'Voice'   },
  { to: '/videos',  icon: Video,         label: 'Videos'  },
  { to: '/history', icon: BookOpen,      label: 'History' },
]

export default function Navbar() {
  const { user, logout, xp, level, streak } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (confirm('Log out bro?')) { logout(); navigate('/') }
  }

  return (
    <nav style={{
      height: 'var(--nav-h)', flexShrink: 0,
      background: 'rgba(6,6,16,.92)', borderBottom: '1px solid var(--border2)',
      backdropFilter: 'blur(24px)', position: 'relative', zIndex: 100,
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 4,
    }}>
      {/* Logo */}
      <NavLink to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, textDecoration: 'none' }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
          background: 'linear-gradient(90deg,var(--purple2),var(--green2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>HOMIE</span>
        <span style={{
          background: 'linear-gradient(135deg,var(--purple),var(--blue))',
          color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px',
          borderRadius: 6, letterSpacing: 1,
        }}>AI</span>
      </NavLink>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
            textDecoration: 'none', transition: 'all .2s',
            color: isActive ? 'var(--purple2)' : 'var(--muted)',
            background: isActive ? 'rgba(139,92,246,.12)' : 'transparent',
          })}>
            <Icon size={15} />
            <span className="hide-mobile">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
        {/* XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hide-mobile">
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            🔥 <b style={{ color: 'var(--text)' }}>{streak}</b>
          </span>
          <div style={{
            background: 'linear-gradient(135deg,var(--purple),var(--pink))',
            borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
            fontFamily: 'var(--font-display)',
          }}>LVL {level}</div>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            ⭐ <b style={{ color: 'var(--text)' }}>{xp}</b>
          </span>
        </div>

        {/* Profile */}
        <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid var(--purple)',
            background: 'linear-gradient(135deg,var(--purple),var(--green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer',
          }}>{user?.avatar || '🧑'}</div>
        </NavLink>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex',
          transition: 'color .2s',
        }} title="Logout"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}
