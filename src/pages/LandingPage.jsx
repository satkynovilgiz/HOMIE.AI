import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    { icon: '🤖', title: 'AI Chat', desc: 'Ask anything. HOMIE explains like a real friend — not a textbook.', color: 'var(--purple)' },
    { icon: '🎤', title: 'Voice Mode', desc: 'Talk hands-free. HOMIE listens and speaks back. Like FaceTime with a genius.', color: 'var(--orange)' },
    { icon: '🎥', title: 'Video Explainers', desc: 'HOMIE finds the perfect YouTube video for any concept automatically.', color: 'var(--green)' },
    { icon: '🎯', title: 'Smart Quizzes', desc: 'Auto-generated quizzes with instant feedback. Earn XP when you nail it.', color: 'var(--blue)' },
    { icon: '⭐', title: 'XP & Levels', desc: 'Study streaks, XP, levels. HOMIE turns studying into a game you want to play.', color: 'var(--yellow)' },
    { icon: '📚', title: '8 Subjects', desc: 'Math, Coding, Science, History, English, Physics, Chemistry, Biology.', color: 'var(--pink)' },
  ]

  return (
    <div style={{ overflowY: 'auto', flex: 1, background: 'var(--bg)' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,6,16,.92)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 64, gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20,
            background: 'linear-gradient(90deg,var(--purple2),var(--green2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>HOMIE</span>
          <span style={{ background: 'linear-gradient(135deg,var(--purple),var(--blue))', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6, letterSpacing: 1 }}>AI</span>
        </div>
        <button onClick={() => navigate('/auth')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid var(--border3)', borderRadius: 10, color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Login</button>
        <button onClick={() => navigate('/auth')} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,var(--purple),var(--blue))', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', boxShadow: '0 4px 15px rgba(139,92,246,.4)' }}>Start Free →</button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '60px 24px 40px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(139,92,246,.1), transparent 60%)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
          borderRadius: 30, background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.25)',
          fontSize: 13, fontWeight: 600, color: 'var(--purple2)',
          fontFamily: 'var(--font-display)', marginBottom: 28,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          100% Free for every student
        </div>

        <h1 style={{
          fontSize: 'clamp(44px,9vw,88px)', fontWeight: 900, letterSpacing: -3,
          fontFamily: 'var(--font-display)', lineHeight: 1.0, marginBottom: 24,
        }}>
          The AI that actually<br />
          <span style={{ background: 'linear-gradient(90deg,var(--purple2),var(--green2),var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            gets you, bro
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 520, lineHeight: 1.65, marginBottom: 36 }}>
          HOMIE explains anything in plain English, quizzes you, finds the perfect video, and talks back — so you actually understand it. Not just memorize.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          <button onClick={() => navigate('/auth')} style={{
            padding: '16px 36px', background: 'linear-gradient(135deg,var(--purple),var(--blue))',
            border: 'none', borderRadius: 16, color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-display)',
            boxShadow: '0 8px 30px rgba(139,92,246,.5)', transition: 'transform .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            Start studying free 🚀
          </button>
          <button onClick={() => navigate('/auth')} style={{
            padding: '16px 36px', background: 'transparent',
            border: '1.5px solid var(--border3)', borderRadius: 16,
            color: 'var(--text)', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple2)'; e.currentTarget.style.color = 'var(--purple2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border3)'; e.currentTarget.style.color = 'var(--text)' }}
          >
            🎤 Try voice mode
          </button>
        </div>

        {/* App preview bubble */}
        <div style={{
          maxWidth: 480, width: '100%',
          background: 'var(--bg3)', border: '1px solid var(--border2)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,.6), 0 0 60px rgba(139,92,246,.1)',
          animation: 'float 6s ease-in-out infinite',
        }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg4)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ef4444','#f59e0b','#10b981'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />)}
            </div>
            <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>homie.ai/chat</div>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { role: 'user', text: 'explain derivatives bro' },
              { role: 'ai', text: 'OKAY so imagine you\'re driving 🚗 — your speed at ANY exact moment? That\'s the derivative. It\'s just the INSTANTANEOUS rate of change. fr once you see it that way it makes sense 🔥' },
              { role: 'ai', text: '🎥 Khan Academy: Derivatives Explained (click to watch →)', isVid: true },
            ].map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'linear-gradient(135deg,var(--purple3),#4c1d95)' : m.isVid ? 'rgba(139,92,246,.1)' : 'var(--bg4)',
                border: m.isVid ? '1px solid rgba(139,92,246,.2)' : m.role === 'ai' ? '1px solid var(--border2)' : 'none',
                padding: '10px 14px', borderRadius: 14,
                borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 14,
                fontSize: 13, lineHeight: 1.5, maxWidth: '85%',
                color: m.role === 'user' ? '#fff' : m.isVid ? 'var(--purple2)' : 'var(--text2)',
              }}>{m.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 32, flexWrap: 'wrap', padding: '28px 36px',
          background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 20,
        }}>
          {[['100%','Free forever'],['8','Subjects'],['Voice','Full voice mode'],['∞','Questions answered']].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, background: 'linear-gradient(135deg,var(--purple2),var(--green2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 24px 100px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--purple2)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>Everything you need to <span style={{ background: 'linear-gradient(90deg,var(--purple2),var(--green2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>level up</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 540, margin: '0 auto' }}>Not a generic chatbot. HOMIE is built for students who want to actually understand — not just copy-paste.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {features.map(({ icon, title, desc, color }) => (
            <div key={title} style={{
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: 20, padding: 28, transition: 'all .25s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = '' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 24px 100px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', padding: '70px 40px',
          background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 28,
          background: 'linear-gradient(135deg,rgba(139,92,246,.08),rgba(59,130,246,.05))',
          border: '1px solid rgba(139,92,246,.2)',
        }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Ready to get that <span style={{ background: 'linear-gradient(90deg,var(--purple2),var(--green2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A+</span>?
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>Join students already using HOMIE to actually understand their classes — not just survive them.</p>
          <button onClick={() => navigate('/auth')} style={{
            padding: '18px 40px', background: 'linear-gradient(135deg,var(--purple),var(--blue))',
            border: 'none', borderRadius: 16, color: '#fff', fontSize: 17, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-display)',
            boxShadow: '0 8px 30px rgba(139,92,246,.5)', transition: 'transform .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            Start for free — takes 30 seconds 🚀
          </button>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>No credit card. No ads. Built by a student, for students.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 24px 28px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>🤖 HOMIE AI</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Built with ❤️ by Ilgiz @ De Anza College</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20 }}>
          <a href="https://github.com/satkynovilgiz/HOMIE.AI" target="_blank" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>GitHub ⭐</a>
          <a href="mailto:satkynovigliz2008@gmail.com" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Email</a>
        </div>
        <div style={{ fontSize: 12, color: 'var(--border3)' }}>© 2025 HOMIE AI · Free for every student</div>
      </footer>
    </div>
  )
}
