import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

const AVATARS = ['🧑','👦','👧','🧔','👩','🧕','🦸','🧙','👨‍💻','👩‍💻','🧑‍🎓','🤖']

export default function AuthPage() {
  const { login, signup, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [avatar, setAvatar] = useState('🧑')
  const [form, setForm] = useState({ name:'', email:'', pass:'' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const doLogin = async () => {
    if (!form.email || !form.pass) { setErr('Fill everything bro! 😅'); return }
    setLoading(true); setErr('')
    const r = login(form.email, form.pass)
    if (r.err) { setErr(r.err); setLoading(false); return }
    showToast(`Welcome back ${r.user.name}! 🔥`, 'var(--green)')
    navigate('/home')
  }

  const doSignup = async () => {
    if (!form.name || !form.email || !form.pass) { setErr('Fill everything bro! 😅'); return }
    if (form.pass.length < 6) { setErr('Password needs 6+ chars 🔐'); return }
    setLoading(true); setErr('')
    const r = signup({ ...form, avatar })
    if (r.err) { setErr(r.err); setLoading(false); return }
    showToast('Account created! Welcome to HOMIE 🎉', 'var(--green)')
    navigate('/home')
  }

  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, overflowY: 'auto',
      background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139,92,246,.08), transparent 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg3)', border: '1px solid var(--border2)',
        borderRadius: 24, padding: '32px 28px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🤖</div>
          <h2 style={{ fontSize: 22, fontFamily: 'var(--font-display)' }}>Welcome to HOMIE</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
            Your AI study bro that actually gets you 🔥
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--bg2)', borderRadius: 12, padding: 4, gap: 4,
        }}>
          {['login','signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr('') }} style={{
              flex: 1, padding: '9px', borderRadius: 9, border: 'none',
              background: tab === t ? 'var(--purple)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              fontFamily: 'var(--font-display)',
            }}>{t === 'login' ? 'Login' : 'Sign Up'}</button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'signup' && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 6 }}>Your Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="What do your friends call you?"
                style={inpStyle} onFocus={focusInp} onBlur={blurInp} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="your@email.com"
              style={inpStyle} onFocus={focusInp} onBlur={blurInp} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={form.pass} onChange={e => set('pass', e.target.value)}
              placeholder={tab === 'signup' ? 'min 6 characters' : '••••••••'}
              onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? doLogin() : doSignup())}
              style={inpStyle} onFocus={focusInp} onBlur={blurInp} />
          </div>

          {tab === 'signup' && (
            <div>
              <label style={labelStyle}>Pick your vibe 🎭</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {AVATARS.map(av => (
                  <button key={av} onClick={() => setAvatar(av)} style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: `2.5px solid ${avatar === av ? 'var(--purple)' : 'var(--border2)'}`,
                    background: 'var(--bg4)', fontSize: 22, cursor: 'pointer',
                    transition: 'all .2s',
                    boxShadow: avatar === av ? '0 0 12px rgba(139,92,246,.5)' : 'none',
                  }}>{av}</button>
                ))}
              </div>
            </div>
          )}

          {err && (
            <div style={{
              padding: '10px 14px', background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.3)', borderRadius: 10,
              fontSize: 13, color: 'var(--red)',
            }}>{err}</div>
          )}

          <button onClick={tab === 'login' ? doLogin : doSignup} disabled={loading} style={{
            padding: '13px', border: 'none', borderRadius: 12, width: '100%',
            background: 'linear-gradient(135deg,var(--purple),var(--blue))',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-display)', transition: 'all .2s',
            opacity: loading ? .6 : 1,
            boxShadow: '0 4px 20px rgba(139,92,246,.3)',
          }}>
            {loading ? '⏳ Loading...' : tab === 'login' ? "Let's Go! 🚀" : 'Create Account 🎉'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have one? '}
            <span onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setErr('') }}
              style={{ color: 'var(--purple2)', cursor: 'pointer', fontWeight: 600 }}>
              {tab === 'login' ? 'Sign up free' : 'Login'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 6 }
const inpStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg4)', border: '1.5px solid var(--border2)', borderRadius: 12, color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color .2s' }
const focusInp = e => e.target.style.borderColor = 'var(--purple)'
const blurInp  = e => e.target.style.borderColor = 'var(--border2)'
