import { useState, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

const SYSTEM = (name) => `You are HOMIE, an AI study buddy. Keep answers SHORT (2-3 sentences) — this is a VOICE conversation. Be hype, casual, Gen Z. Student name: ${name || 'bro'}.`

export default function VoicePage() {
  const { user, voiceEnabled, showToast } = useApp()
  const [status, setStatus] = useState('idle') // idle | listening | thinking | speaking
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [history, setHistory] = useState([])
  const convRef = useRef([])
  const recRef = useRef(null)
  const synth = window.speechSynthesis
  const navigate = useNavigate()

  const speak = useCallback((text, onDone) => {
    synth.cancel()
    const clean = text.replace(/\*\*/g, '').replace(/[^\w\s.,!?'-]/g, ' ').slice(0, 400)
    const u = new SpeechSynthesisUtterance(clean)
    u.rate = 1.05; u.pitch = 1.05; u.volume = 0.9
    const v = synth.getVoices().find(v => v.name.includes('Google US English'))
      || synth.getVoices().find(v => v.lang.startsWith('en-US')) || null
    if (v) u.voice = v
    u.onend = u.onerror = () => { if (onDone) onDone() }
    synth.speak(u)
  }, [])

  const handleInput = useCallback(async (text) => {
    if (!text.trim()) return
    setTranscript(text)
    setStatus('thinking')
    convRef.current.push({ role: 'user', content: text })
    setHistory(h => [...h, { role: 'user', text }])
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6', max_tokens: 300,
          system: SYSTEM(user?.name),
          messages: convRef.current,
        }),
      })
      const data = await res.json()
      let r = data.content?.[0]?.text || "yo I glitched, try again!"
      r = r.replace(/VIDEO_SUGGEST:.+/g, '').trim()
      convRef.current.push({ role: 'assistant', content: r })
      if (convRef.current.length > 20) convRef.current = convRef.current.slice(-20)
      setReply(r)
      setHistory(h => [...h, { role: 'ai', text: r }])
      setStatus('speaking')
      speak(r, () => setStatus('idle'))
    } catch {
      setStatus('idle')
      showToast('Connection error 😭', 'var(--red)')
    }
  }, [user, speak, showToast])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { showToast('Voice needs Chrome bro! 😅', 'var(--orange)'); return }
    synth.cancel()
    const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false
    rec.onresult = e => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(interim)
      if (e.results[e.results.length - 1].isFinal) { stopListening(); handleInput(interim) }
    }
    rec.onerror = () => { setStatus('idle') }
    rec.onend = () => { if (status === 'listening') setStatus('idle') }
    rec.start(); recRef.current = rec; setStatus('listening')
  }, [handleInput, showToast, status])

  const stopListening = useCallback(() => {
    recRef.current?.stop(); setStatus('idle')
  }, [])

  const toggle = () => {
    if (status === 'listening') stopListening()
    else if (status === 'idle') startListening()
  }

  const stopAll = () => { synth.cancel(); recRef.current?.stop(); setStatus('idle') }

  const orbColor = {
    idle: 'linear-gradient(135deg,var(--purple),var(--blue))',
    listening: 'linear-gradient(135deg,var(--orange),var(--pink))',
    thinking: 'linear-gradient(135deg,var(--blue),var(--cyan))',
    speaking: 'linear-gradient(135deg,var(--green),var(--cyan))',
  }[status]

  const statusText = { idle: 'Tap to start talking', listening: 'Listening... 👂', thinking: 'HOMIE is thinking...', speaking: 'HOMIE is speaking 🔊' }[status]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        {/* Orb */}
        <div onClick={toggle} style={{
          width: 160, height: 160, borderRadius: '50%', margin: '0 auto 28px',
          background: orbColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 60, cursor: 'pointer', position: 'relative',
          boxShadow: `0 0 40px rgba(139,92,246,.3)`,
          animation: status === 'listening' ? 'glow 1s infinite alternate' : status === 'speaking' ? 'float 1s ease-in-out infinite' : 'none',
          transition: 'background .4s',
        }}>
          {status === 'idle' ? '🎤' : status === 'listening' ? '👂' : status === 'thinking' ? '🤔' : '🔊'}
          {/* Rings */}
          {['idle','listening','speaking'].includes(status) && (
            <>
              <div style={{ position:'absolute',inset:-14,borderRadius:'50%',border:'2px solid rgba(139,92,246,.25)',animation:'float 3s ease-in-out infinite' }} />
              <div style={{ position:'absolute',inset:-28,borderRadius:'50%',border:'1px solid rgba(139,92,246,.12)',animation:'float 3s ease-in-out infinite .5s' }} />
            </>
          )}
        </div>

        <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, marginBottom:8 }}>{statusText}</h2>
        <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>
          {status === 'idle' ? 'Tap the orb to talk to HOMIE out loud 🎤' : ''}
        </p>

        {transcript && (
          <div style={{ background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:16,padding:16,marginBottom:14,textAlign:'left',fontSize:14,lineHeight:1.6 }}>
            <div style={{ fontSize:11,color:'var(--muted)',fontWeight:700,textTransform:'uppercase',marginBottom:6 }}>You said</div>
            {transcript}
          </div>
        )}

        {reply && (
          <div style={{ background:'rgba(139,92,246,.08)',border:'1px solid rgba(139,92,246,.2)',borderRadius:16,padding:16,marginBottom:20,textAlign:'left',fontSize:14,lineHeight:1.6 }}>
            <div style={{ fontSize:11,color:'var(--purple2)',fontWeight:700,textTransform:'uppercase',marginBottom:6 }}>🤖 HOMIE</div>
            {reply}
          </div>
        )}

        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:24 }}>
          <button onClick={toggle} style={{
            width:64,height:64,borderRadius:'50%',border:'none',cursor:'pointer',fontSize:26,
            background: status === 'listening' ? 'linear-gradient(135deg,var(--orange),var(--pink))' : 'linear-gradient(135deg,var(--purple),var(--blue))',
            boxShadow:'0 6px 20px rgba(139,92,246,.4)', display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            {status === 'listening' ? '⏹' : '🎤'}
          </button>
          <button onClick={stopAll} style={{
            width:64,height:64,borderRadius:'50%',border:'1.5px solid var(--border2)',cursor:'pointer',
            fontSize:20,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',
          }}>🔇</button>
        </div>

        <button onClick={() => navigate('/chat')} style={{
          padding:'10px 20px',background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:12,
          color:'var(--text2)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',
        }}>Switch to Chat 💬</button>

        {/* Voice history */}
        {history.length > 0 && (
          <div style={{ marginTop:28, textAlign:'left' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontSize:14,marginBottom:12,color:'var(--muted)' }}>Conversation</h3>
            {[...history].reverse().slice(0,8).map((m, i) => (
              <div key={i} style={{ background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:12,padding:'12px 14px',marginBottom:8 }}>
                <div style={{ fontSize:11,color:m.role==='user'?'var(--purple2)':'var(--green)',fontWeight:700,marginBottom:4 }}>
                  {m.role === 'user' ? `${user?.avatar || '🧑'} You` : '🤖 HOMIE'}
                </div>
                <div style={{ fontSize:13,lineHeight:1.5 }}>{m.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
