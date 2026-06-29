import { useState } from 'react'
import { VIDEO_DB, filterVideos } from '../utils/videos.js'

const FILTERS = [
  { k:'all',       l:'All' },
  { k:'math',      l:'➗ Math' },
  { k:'coding',    l:'💻 Coding' },
  { k:'science',   l:'🔬 Science' },
  { k:'history',   l:'📜 History' },
  { k:'physics',   l:'⚛️ Physics' },
  { k:'biology',   l:'🧬 Biology' },
  { k:'chemistry', l:'🧪 Chemistry' },
]

function VideoModal({ video, onClose }) {
  if (!video) return null
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'100%',maxWidth:760,background:'var(--bg3)',borderRadius:20,overflow:'hidden',border:'1px solid var(--border2)' }}>
        <div style={{ padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:15,flex:1,marginRight:12,fontFamily:'var(--font-display)' }}>{video.title}</h3>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--muted)',fontSize:22,cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ position:'relative',paddingBottom:'56.25%',height:0 }}>
          <iframe src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`} style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none' }} allowFullScreen allow="autoplay; encrypted-media" />
        </div>
      </div>
    </div>
  )
}

export default function VideosPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const vids = filterVideos(filter, search)

  return (
    <div style={{ flex:1,overflowY:'auto',padding:'24px 20px' }}>
      <h1 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:24,marginBottom:6 }}>🎥 Video Explainers</h1>
      <p style={{ color:'var(--muted)',fontSize:14,marginBottom:20 }}>HOMIE finds the perfect video for whatever you're studying</p>

      {/* Search */}
      <div style={{ display:'flex',gap:10,marginBottom:20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search any topic... e.g. 'how do black holes work'"
          style={{ flex:1,padding:'12px 16px',background:'var(--bg3)',border:'1.5px solid var(--border2)',borderRadius:12,color:'var(--text)',fontSize:14,outline:'none',fontFamily:'var(--font-body)' }}
          onFocus={e => e.target.style.borderColor='var(--purple)'}
          onBlur={e => e.target.style.borderColor='var(--border2)'}
        />
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:20 }}>
        {FILTERS.map(({ k, l }) => (
          <button key={k} onClick={() => { setFilter(k); setSearch('') }} style={{
            padding:'6px 14px',borderRadius:20,border:`1.5px solid ${filter===k?'transparent':'var(--border2)'}`,
            background: filter===k ? 'linear-gradient(135deg,var(--purple),var(--blue))' : 'transparent',
            color: filter===k ? '#fff' : 'var(--muted)',
            fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .2s',fontFamily:'var(--font-display)',
          }}>{l}</button>
        ))}
      </div>

      {/* Grid */}
      {vids.length === 0 ? (
        <div style={{ textAlign:'center',padding:'60px 20px',color:'var(--muted)' }}>
          <div style={{ fontSize:48,marginBottom:12 }}>🔍</div>
          <p>No videos found — try a different search!</p>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16 }}>
          {vids.map(v => (
            <div key={v.id} onClick={() => setModal(v)} style={{
              background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:16,
              overflow:'hidden',cursor:'pointer',transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--purple)'; e.currentTarget.style.transform='translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='' }}
            >
              <div style={{ position:'relative' }}>
                <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} style={{ width:'100%',display:'block',aspectRatio:'16/9',objectFit:'cover' }} loading="lazy" />
                <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.3)' }}>
                  <div style={{ width:44,height:44,borderRadius:'50%',background:'rgba(139,92,246,.9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff' }}>▶</div>
                </div>
              </div>
              <div style={{ padding:'12px 14px' }}>
                <span style={{ background:'rgba(139,92,246,.15)',color:'var(--purple2)',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:20,fontFamily:'var(--font-display)',display:'inline-block',marginBottom:6 }}>{v.subj}</span>
                <h4 style={{ fontSize:14,fontWeight:600,lineHeight:1.4,marginBottom:4 }}>{v.title}</h4>
                <p style={{ fontSize:12,color:'var(--muted)' }}>📺 {v.channel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <VideoModal video={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
