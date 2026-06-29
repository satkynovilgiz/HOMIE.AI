import { useState, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { findVideo } from '../utils/videos.js'

const SUBJECTS = [
  { s: 'Math',      e: '➗' },
  { s: 'Coding',    e: '💻' },
  { s: 'Science',   e: '🔬' },
  { s: 'History',   e: '📜' },
  { s: 'English',   e: '✍️' },
  { s: 'Physics',   e: '⚛️' },
  { s: 'Chemistry', e: '🧪' },
  { s: 'Biology',   e: '🧬' },
]

function buildSystem(subject, userName) {
  return `You are HOMIE — the coolest AI study buddy ever. Talk like a Gen Z best friend: energetic, funny, hype, supportive. Use casual slang naturally: "bro", "yo", "fr", "ngl", "lowkey". Use CAPS for emphasis. Use emojis naturally.

Current subject: ${subject}
Student name: ${userName || 'bro'}

RULES:
1. Talk like a hype friend who genuinely wants you to succeed
2. Make analogies with real life: gaming, food, TikTok, movies
3. Keep answers SHORT unless asked for more
4. When giving a quiz format EXACTLY like this:
QUIZ_START
Q: [question]
A) [option]
B) [option]
C) [option]
D) [option]
CORRECT: [letter]
EXPLANATION: [one sentence]
QUIZ_END
5. When a video would help, include: VIDEO_SUGGEST: [search term]
6. Celebrate wins with "LETS GOOO 🔥", comfort losses with "nah bro don't stress"
7. End with a follow-up question or next step`
}

function parseQuiz(text) {
  if (!text.includes('QUIZ_START')) return null
  const block = text.match(/QUIZ_START([\s\S]+?)QUIZ_END/)
  if (!block) return null
  const raw = block[1]
  const q = (raw.match(/Q:\s*(.+)/) || [])[1]
  const opts = []
  ;['A', 'B', 'C', 'D'].forEach(l => {
    const m = raw.match(new RegExp(`${l}\\)\\s*(.+)`))
    if (m) opts.push({ l, t: m[1].trim() })
  })
  const ans = (raw.match(/CORRECT:\s*([A-D])/i) || [])[1]?.toUpperCase()
  const exp = (raw.match(/EXPLANATION:\s*(.+)/) || [])[1]
  if (!q || opts.length < 2) return null
  return { q, opts, ans, exp }
}

export function useChat() {
  const { user, addXP, addCorrect, resetStreak, bumpMsgs, autoVid, voiceEnabled, saveHistory, showToast } = useApp()
  const [messages, setMessages] = useState([])
  const [subject, setSubject] = useState('Math')
  const [subjEmoji, setSubjEmoji] = useState('➗')
  const [loading, setLoading] = useState(false)
  const historyRef = useRef([])
  const sessionRef = useRef({ msgs: [], xpEarned: 0, start: Date.now() })
  const synth = window.speechSynthesis

  const speak = useCallback((text) => {
    if (!synth || !voiceEnabled) return
    synth.cancel()
    const clean = text.replace(/\*\*/g, '').replace(/[^\w\s.,!?'-]/g, ' ').slice(0, 300)
    const u = new SpeechSynthesisUtterance(clean)
    u.rate = 1.1; u.pitch = 1.05; u.volume = 0.85
    const v = synth.getVoices().find(v => v.name.includes('Google US English'))
      || synth.getVoices().find(v => v.lang.startsWith('en-US')) || null
    if (v) u.voice = v
    synth.speak(u)
  }, [voiceEnabled])

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random() }])
  }, [])

  const initChat = useCallback(() => {
    historyRef.current = []
    sessionRef.current = { msgs: [], xpEarned: 0, start: Date.now() }
    setMessages([{
      id: 0, role: 'ai',
      text: `YO ${user?.name || 'bro'}!! 👋🔥\n\nI'm HOMIE — your personal AI study buddy. No boring lectures, I promise 😤\n\nPick a subject, ask me anything, or hit the quick buttons. Let's get it! 🧠💪`,
    }])
  }, [user])

  const switchSubject = useCallback((s, e) => {
    setSubject(s); setSubjEmoji(e)
    historyRef.current = []
    sessionRef.current = { msgs: [], xpEarned: 0, start: Date.now() }
    setMessages([{
      id: Date.now(), role: 'ai',
      text: `aight switching to ${e} **${s}** mode! Let's GET IT 🚀\n\nWhat do you need help with?`,
    }])
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return
    addMessage({ role: 'user', text })
    historyRef.current.push({ role: 'user', content: text })
    sessionRef.current.msgs.push({ role: 'user', text, ts: Date.now() })
    bumpMsgs()
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: buildSystem(subject, user?.name),
          messages: historyRef.current,
        }),
      })
      const data = await res.json()
      let reply = data.content?.[0]?.text || "yo my brain glitched 😂 try again!"
      historyRef.current.push({ role: 'assistant', content: reply })
      sessionRef.current.msgs.push({ role: 'ai', text: reply, ts: Date.now() })

      // Parse video
      let video = null
      const vidMatch = reply.match(/VIDEO_SUGGEST:\s*(.+)/)
      if (vidMatch && autoVid) {
        video = findVideo(vidMatch[1].trim())
        reply = reply.replace(/VIDEO_SUGGEST:.+/, '').trim()
      }

      // Parse quiz
      const quiz = parseQuiz(reply)
      if (quiz) {
        const pre = reply.split('QUIZ_START')[0].trim()
        if (pre) addMessage({ role: 'ai', text: pre })
        addMessage({ role: 'ai', quiz })
      } else {
        addMessage({ role: 'ai', text: reply, video })
        speak(reply)
      }

      // Save session periodically
      if (sessionRef.current.msgs.length > 1) {
        saveHistory({
          id: sessionRef.current.start,
          subject, subjEmoji,
          preview: sessionRef.current.msgs.find(m => m.role === 'user')?.text || 'Chat session',
          msgs: sessionRef.current.msgs.slice(0, 30),
          xpEarned: sessionRef.current.xpEarned,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: Math.round((Date.now() - sessionRef.current.start) / 60000),
        })
      }
    } catch {
      addMessage({ role: 'ai', text: "bro the connection glitched 😭 check your internet and try again!" })
    }
    setLoading(false)
  }, [loading, subject, subjEmoji, user, addMessage, bumpMsgs, autoVid, speak, saveHistory])

  const handleQuizAnswer = useCallback((quiz, chosen, addMsg) => {
    if (chosen === quiz.ans) {
      addCorrect()
      const earned = 15
      addXP(earned)
      sessionRef.current.xpEarned += earned
      showToast(`🔥 CORRECT! +${earned} XP`, 'var(--green)')
      addMsg({ role: 'ai', text: `YOOOO LETS GOOO!! 🎉🔥 **${chosen})** is RIGHT!\n\n${quiz.exp || ''}\n\nYou're built different fr 💪 Want another one?` })
    } else {
      resetStreak()
      addMsg({ role: 'ai', text: `nah bro, not this time 😅 Answer was **${quiz.ans}**. ${quiz.exp || ''}\n\nDon't stress — want me to explain it differently? 🤙` })
    }
    addXP(5)
  }, [addCorrect, addXP, resetStreak, showToast])

  return {
    messages, loading, subject, subjEmoji,
    SUBJECTS, initChat, switchSubject, sendMessage,
    handleQuizAnswer, addMessage,
  }
}
