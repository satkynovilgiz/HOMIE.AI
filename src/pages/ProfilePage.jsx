import { useApp } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

const AVATARS = ['🧑','👦','👧','🧔','👩','🧕','🦸','🧙','👨‍💻','👩‍💻','🧑‍🎓','🤖']

export default function ProfilePage() {
  const { user, xp, level, streak, correct, voiceEnabled, autoVid, updateSetting, updateAvatar, logout, DB, showToast } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => { if (confirm('Log out bro?')) { logout(); navigate('/') } }
  const clearHistory = () => {
    if (!confirm('Clear all history? This is permanent 😬')) return
    DB.updateUser(user.email, { history: [] })
    showToast('History cleared!', 'var(--orange)')
  }

  const stats = [
    { label:'Total XP', val: xp, icon:'💎' },
    { label:'Level', val: level, icon:'⭐' },
    { label:'Streak', val: streak, icon:'🔥' },
    { label:'Correct', val: correct, icon:'✅' },
    { label:'Sessions', val: user?.sessions||0, icon:'📚' },
    { label:'Messages', val: user?.msgsSent||0, icon:'💬' },
  ]

  return (
    <div style={{ flex:1,overflowY:'auto',padding:'24px 20px',maxWidth:700,margin:'0 auto',width:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex',alignItems:'center',gap:20,marginBottom:28,flexWrap:'wrap' }}>
        <div style={{ width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--purple),var(--green))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,border:'3px solid var(--purple)',boxShadow:'0 0 24px rgba(139,92,246,.4)' }}>
          {user?.avatar || '🧑'}
        </div>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:22 }}>{user?.name}</h2>
          <p style={{ color:'var(--muted)',fontSize:14,marginTop:2 }}>{user?.email}</p>
          <div style={{ display:'flex',gap:8,marginTop:8,flexWrap:'wrap' }}>
            {[['purple',`LVL ${level}`],['green',`🔥 ${streak} streak`],['orange',`Joined ${user?.joined}`]].map(([c,t]) => (
              <span key={t} style={{
                padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,fontFamily:'var(--font-display)',
                background:`rgba(${c==='purple'?'139,92,246':c==='green'?'16,185,129':'249,115,22'},.2)`,
                color:`var(--${c})`,
                border:`1px solid rgba(${c==='purple'?'139,92,246':c==='green'?'16,185,129':'249,115,22'},.3)`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:10,marginBottom:28 }}>
        {stats.map(({ label, val, icon }) => (
          <div key={label} style={{ background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:14,padding:16,textAlign:'center' }}>
            <div style={{ fontSize:20,marginBottom:6 }}>{icon}</div>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:900,fontSize:24,background:'linear-gradient(135deg,var(--purple2),var(--green2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{val}</div>
            <div style={{ fontSize:11,color:'var(--muted)',marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Avatar picker */}
      <h3 style={{ fontFamily:'var(--font-display)',fontSize:16,marginBottom:12 }}>🎭 Change Avatar</h3>
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:24 }}>
        {AVATARS.map(av => (
          <button key={av} onClick={() => { updateAvatar(av); showToast('Avatar updated! '+av,'var(--green)') }} style={{
            width:44,height:44,borderRadius:'50%',border:`2.5px solid ${user?.avatar===av?'var(--purple)':'var(--border2)'}`,
            background:'var(--bg4)',fontSize:22,cursor:'pointer',transition:'all .2s',
            boxShadow:user?.avatar===av?'0 0 12px rgba(139,92,246,.5)':'none',
          }}>{av}</button>
        ))}
      </div>

      {/* Settings */}
      <h3 style={{ fontFamily:'var(--font-display)',fontSize:16,marginBottom:12 }}>⚙️ Settings</h3>
      <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:24 }}>
        {[
          { icon:'🔊', title:'Voice replies', sub:'HOMIE speaks back in chat', key:'voiceEnabled', val:voiceEnabled },
          { icon:'🎥', title:'Auto video suggestions', sub:'HOMIE recommends videos in chat', key:'autoVid', val:autoVid },
        ].map(({ icon, title, sub, key, val }) => (
          <div key={key} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:14,padding:'14px 18px' }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:36,height:36,background:'var(--bg4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{icon}</div>
              <div>
                <div style={{ fontSize:14,fontWeight:600 }}>{title}</div>
                <div style={{ fontSize:12,color:'var(--muted)',marginTop:1 }}>{sub}</div>
              </div>
            </div>
            <button onClick={() => { updateSetting(key, !val); showToast(val?`${title} OFF`:`${title} ON`) }} style={{
              padding:'8px 16px',background:val?'rgba(16,185,129,.15)':'var(--bg4)',
              border:`1px solid ${val?'rgba(16,185,129,.3)':'var(--border2)'}`,
              color:val?'var(--green)':'var(--muted)',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',
            }}>{val?'ON':'OFF'}</button>
          </div>
        ))}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:14,padding:'14px 18px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:36,height:36,background:'var(--bg4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🗑️</div>
            <div>
              <div style={{ fontSize:14,fontWeight:600 }}>Clear history</div>
              <div style={{ fontSize:12,color:'var(--muted)',marginTop:1 }}>Delete all chat sessions</div>
            </div>
          </div>
          <button onClick={clearHistory} style={{ padding:'8px 16px',background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',color:'var(--red)',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)' }}>Clear</button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        <button onClick={() => window.open('https://github.com/satkynovilgiz/HOMIE.AI','_blank')} style={{ padding:'13px',background:'var(--bg3)',border:'1px solid var(--border3)',borderRadius:12,color:'var(--text)',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)' }}>
          ⭐ Star on GitHub
        </button>
        <button onClick={handleLogout} style={{ padding:'13px',background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:12,color:'var(--red)',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
