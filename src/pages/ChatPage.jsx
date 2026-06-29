import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '../hooks/useChat.js'
import { useApp } from '../context/AppContext.jsx'
import { Send, Mic, MicOff } from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────
function fmtText(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`(.+?)`/g, '<code style="background:var(--bg4);padding:2px 6px;border-radius:5px;font-size:13px;font-family:monospace">$1</code>')
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
}

// ── Quiz Card ────────────────────────────────────────────────
function QuizCard({ quiz, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  const pick = (l) => { if (chosen) return; setChosen(l); onAnswer(quiz, l) }
  return (
    <div style={{
      background: 'var(--bg4)', border: '1.5px solid var(--purple)',
      borderRadius: 16, padding: 18, marginTop: 4,
      boxShadow: '0 4px 20px rgba(139,92,246,.15)',
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, lineHeight: 1.5 }}>❓ {quiz.q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quiz.opts.map(({ l, t }) => {
          const isChosen = chosen === l
          const correct = quiz.ans === l
          let bg = 'var(--bg3)', border = 'var(--border2)', color = 'var(--text)'
          if (chosen) {
            if (correct) { bg = 'rgba(16,185,129,.12)'; border = 'var(--green)'; color = 'var(--green)' }
            else if (isChosen) { bg = 'rgba(239,68,68,.1)'; border = 'var(--red)'; color = 'var(--red)' }
          }
          return (
            <button key={l} onClick={() => pick(l)} style={{
              padding: '10px 14px', background: bg,
              border: `1.5px solid ${border}`, borderRadius: 12,
              cursor: chosen ? 'default' : 'pointer', fontSize: 13,
              color, textAlign: 'left', transition: 'all .2s', fontFamily: 'var(--font-body)',
            }}
              onMouseEnter={e => { if (!chosen) e.currentTarget.style.borderColor = 'var(--purple2)' }}
              onMouseLeave={e => { if (!chosen) e.currentTarget.style.borderColor = 'var(--border2)' }}
            >
              {l}) {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Video Card ───────────────────────────────────────────────
function VideoCard({ video, onOpen }) {
  return (
    <div onClick={() => onOpen(video)} style={{
      background: 'var(--bg4)', border: '1px solid var(--border2)',
      borderRadius: 14, overflow: 'hidden', marginTop: 8,
      maxWidth: 360, cursor: 'pointer', transition: 'all .2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
    >
      <div style={{ position: 'relative' }}>
        <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title} style={{ width: '100%', display: 'block' }} loading="lazy" />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,.35)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(139,92,246,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff',
          }}>▶</div>
        </div>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>{video.title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>📺 {video.channel}</div>
      </div>
    </div>
  )
}

// ── Message ──────────────────────────────────────────────────
function Message({ msg, user, onQuizAnswer, onVideoOpen }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', gap: 9, alignItems: 'flex-end', maxWidth: '88%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeUp .3s ease',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg,var(--orange),var(--pink))'
          : 'linear-gradient(135deg,var(--purple),var(--green))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>
        {isUser ? (user?.avatar || '🧑') : '🤖'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 'calc(100% - 39px)' }}>
        {msg.quiz ? (
          <QuizCard quiz={msg.quiz} onAnswer={onQuizAnswer} />
        ) : (
          <div style={{
            padding: '11px 15px', borderRadius: 18, fontSize: 14, lineHeight: 1.55,
            background: isUser ? 'linear-gradient(135deg,var(--purple3),#4c1d95)' : 'var(--bg3)',
            border: isUser ? 'none' : '1px solid var(--border2)',
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
            color: isUser ? '#fff' : 'var(--text)',
          }} dangerouslySetInnerHTML={{ __html: fmtText(msg.text || '') }} />
        )}
        {msg.video && <VideoCard video={msg.video} onOpen={onVideoOpen} />}
      </div>
    </div>
  )
}

// ── Video Modal ──────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  if (!video) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 760,
        background: 'var(--bg3)', borderRadius: 20, overflow: 'hidden',
        border: '1px solid var(--border2)',
      }}>
        <div style={{
          padding: '14px 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: 15, flex: 1, marginRight: 12 }}>{video.title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            fontSize: 22, cursor: 'pointer',
          }}>✕</button>
        </div>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen allow="autoplay; encrypted-media"
          />
        </div>
      </div>
    </div>
  )
}

// ── Main ChatPage ────────────────────────────────────────────
const QUICK = ['Quiz me! 🎯', 'Explain super simply 🧠', 'Show me a video 🎥', 'Give me a fun example 😂', 'Why do I need this IRL? 🤔', 'Challenge me 💪']

export default function ChatPage() {
  const { user, xp, streak, level, xpProgress } = useApp()
  const {
    messages, loading, subject, subjEmoji,
    SUBJECTS, initChat, switchSubject, sendMessage, handleQuizAnswer, addMessage,
  } = useChat()
  const [input, setInput] = useState('')
  const [micOn, setMicOn] = useState(false)
  const [modalVideo, setModalVideo] = useState(null)
  const msgsRef = useRef(null)
  const recRef = useRef(null)

  useEffect(() => { initChat() }, [])
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, loading])

  const send = useCallback((override) => {
    const txt = override || input
    if (!txt.trim()) return
    setInput('')
    sendMessage(txt)
  }, [input, sendMessage])

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const toggleMic = () => {
    if (micOn) { recRef.current?.stop(); setMicOn(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Voice needs Chrome bro!'); return }
    const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false
    rec.onresult = (e) => { const t = e.results[0][0].transcript; setMicOn(false); send(t) }
    rec.onerror = () => setMicOn(false)
    rec.onend = () => setMicOn(false)
    rec.start(); recRef.current = rec; setMicOn(true)
  }

  const onQuizAnswer = (quiz, chosen) => handleQuizAnswer(quiz, chosen, addMessage)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Subject bar */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 14px', overflowX: 'auto', scrollbarWidth: 'none',
        background: 'rgba(12,12,30,.8)', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        {SUBJECTS.map(({ s, e }) => (
          <button key={s} onClick={() => switchSubject(s, e)} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 30,
            border: `1.5px solid ${subject === s ? 'transparent' : 'var(--border2)'}`,
            background: subject === s
              ? 'linear-gradient(135deg,var(--purple),var(--blue))'
              : 'transparent',
            color: subject === s ? '#fff' : 'var(--muted)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
            fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
            boxShadow: subject === s ? '0 4px 15px rgba(139,92,246,.35)' : 'none',
          }}>{e} {s}</button>
        ))}
      </div>

      {/* XP strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '5px 14px',
        background: 'rgba(12,12,30,.6)', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>🔥 <b style={{ color: 'var(--text)' }}>{streak}</b></span>
        <div style={{ flex: 1, height: 4, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg,var(--purple),var(--green))',
            width: `${xpProgress}%`, transition: 'width .6s cubic-bezier(.34,1.56,.64,1)',
          }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>⭐ <b style={{ color: 'var(--text)' }}>{xp}</b></span>
        <div style={{
          background: 'linear-gradient(135deg,var(--purple),var(--pink))',
          borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          fontFamily: 'var(--font-display)',
        }}>LVL {level}</div>
      </div>

      {/* Messages */}
      <div ref={msgsRef} style={{
        flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} user={user}
            onQuizAnswer={onQuizAnswer} onVideoOpen={setModalVideo} />
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-end', alignSelf: 'flex-start' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--purple),var(--green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🤖</div>
            <div style={{
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: 18, borderBottomLeftRadius: 4, padding: '14px 18px',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              {[0, 0.18, 0.36].map((d, i) => (
                <div key={i} style={{
                  width: 7, height: 7, background: 'var(--muted)', borderRadius: '50%',
                  animation: `dotBounce 1.1s ${d}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick buttons */}
      <div style={{
        display: 'flex', gap: 6, padding: '6px 14px 4px', overflowX: 'auto',
        scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} style={{
            flexShrink: 0, padding: '6px 13px', background: 'var(--bg3)',
            border: '1px solid var(--border2)', borderRadius: 20,
            color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
            transition: 'all .2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)' }}
          >{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 14px 16px', background: 'rgba(12,12,30,.95)',
        borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button onClick={toggleMic} style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: micOn ? 'var(--orange)' : 'var(--bg3)',
            border: `1.5px solid ${micOn ? 'var(--orange)' : 'var(--border2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', animation: micOn ? 'glow 1s infinite alternate' : 'none',
            transition: 'all .2s',
          }}>
            {micOn ? <MicOff size={18} color="#fff" /> : <Mic size={18} color="var(--text)" />}
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={`Ask anything about ${subjEmoji} ${subject}... no judgment 🤙`}
            rows={1}
            style={{
              flex: 1, background: 'var(--bg3)', border: '1.5px solid var(--border2)',
              borderRadius: 22, padding: '11px 16px', color: 'var(--text)',
              fontSize: 14, fontFamily: 'var(--font-body)', resize: 'none',
              outline: 'none', maxHeight: 110, lineHeight: 1.4, transition: 'border-color .2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px' }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,var(--purple),var(--blue))',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: !input.trim() || loading ? .35 : 1, transition: 'all .2s',
          }}>
            <Send size={18} color="#fff" />
          </button>
        </div>
        {micOn && (
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--orange)', marginTop: 6, fontWeight: 600 }}>
            🎤 Listening... speak now!
          </div>
        )}
      </div>

      {modalVideo && <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />}
    </div>
  )
}
