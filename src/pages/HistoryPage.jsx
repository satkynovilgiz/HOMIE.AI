// HistoryPage
import { useApp } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

export function HistoryPage() {
  const { user, DB } = useApp()
  const hist = user?.history || []

  return (
    <div style={{ flex:1,overflowY:'auto',padding:'24px 20px' }}>
      <h1 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:24,marginBottom:6 }}>📚 My Learning History</h1>
      <p style={{ color:'var(--muted)',fontSize:14,marginBottom:24 }}>Every session you've studied with HOMIE</p>
      {hist.length === 0 ? (
        <div style={{ textAlign:'center',padding:'60px 20px',color:'var(--muted)' }}>
          <div style={{ fontSize:48,marginBottom:12 }}>📭</div>
          <p style={{ fontSize:16 }}>No chats yet bro — go learn something! 🚀</p>
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
          {hist.map(s => (
            <div key={s.id} style={{
              background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:16,padding:'16px 20px',
              cursor:'pointer',transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--purple)'; e.currentTarget.style.transform='translateX(4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='' }}
            >
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
                <span style={{ background:'rgba(139,92,246,.15)',color:'var(--purple2)',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,fontFamily:'var(--font-display)' }}>
                  {s.subjEmoji} {s.subject}
                </span>
                <span style={{ fontSize:11,color:'var(--muted)',marginLeft:'auto' }}>{s.date} {s.time}</span>
              </div>
              <div style={{ fontSize:13,color:'var(--text2)',lineHeight:1.4,marginBottom:10,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' }}>
                {s.preview}
              </div>
              <div style={{ display:'flex',gap:16 }}>
                {[['💬',s.msgs?.length||0,'messages'],['⭐',s.xpEarned||0,'XP'],s.duration&&['⏱️',s.duration,'min']].filter(Boolean).map(([icon,val,label]) => (
                  <span key={label} style={{ fontSize:11,color:'var(--muted)',display:'flex',alignItems:'center',gap:4 }}>{icon} {val} {label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
