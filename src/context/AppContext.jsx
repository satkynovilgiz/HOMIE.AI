import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

// ── LocalStorage DB ─────────────────────────────────────────
const DB = {
  getUsers() { try { return JSON.parse(localStorage.getItem('hm_users') || '[]') } catch { return [] } },
  saveUsers(u) { localStorage.setItem('hm_users', JSON.stringify(u)) },
  getUser(email) { return this.getUsers().find(u => u.email === email) || null },
  createUser({ name, email, pass, avatar = '🧑' }) {
    const users = this.getUsers()
    if (users.find(u => u.email === email)) return { err: 'Email already exists' }
    const user = {
      id: Date.now().toString(), name, email, pass: btoa(pass), avatar,
      xp: 0, level: 1, streak: 0, correct: 0, sessions: 0, msgsSent: 0,
      joined: new Date().toLocaleDateString(),
      history: [], voiceEnabled: true, autoVid: true,
    }
    users.push(user); this.saveUsers(users); return { user }
  },
  loginUser(email, pass) {
    const u = this.getUser(email)
    if (!u) return { err: 'No account with that email' }
    if (u.pass !== btoa(pass)) return { err: 'Wrong password bro 😅' }
    return { user: u }
  },
  updateUser(email, updates) {
    const users = this.getUsers()
    const i = users.findIndex(u => u.email === email)
    if (i < 0) return
    Object.assign(users[i], updates)
    this.saveUsers(users)
  },
  addHistory(email, session) {
    const users = this.getUsers()
    const u = users.find(u => u.email === email)
    if (!u) return
    u.history = u.history || []
    u.history.unshift(session)
    if (u.history.length > 60) u.history = u.history.slice(0, 60)
    this.saveUsers(users)
  },
}

// ── Provider ─────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [autoVid, setAutoVid] = useState(true)
  const [toast, setToast] = useState(null)

  // Toast helper
  const showToast = useCallback((msg, color = 'var(--purple)') => {
    setToast({ msg, color, id: Date.now() })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // Login
  const login = useCallback((email, pass) => {
    const r = DB.loginUser(email, pass)
    if (r.err) return r
    const u = r.user
    setUser(u); setXp(u.xp || 0); setStreak(u.streak || 0); setCorrect(u.correct || 0)
    setVoiceEnabled(u.voiceEnabled !== false); setAutoVid(u.autoVid !== false)
    localStorage.setItem('hm_session', JSON.stringify(u))
    return { user: u }
  }, [])

  // Signup
  const signup = useCallback((data) => {
    const r = DB.createUser(data)
    if (r.err) return r
    return login(data.email, data.pass)
  }, [login])

  // Logout
  const logout = useCallback(() => {
    setUser(null); setXp(0); setStreak(0); setCorrect(0)
    localStorage.removeItem('hm_session')
  }, [])

  // Add XP
  const addXP = useCallback((pts) => {
    setXp(prev => {
      const next = prev + pts
      const prevLvl = Math.floor(prev / 100) + 1
      const nextLvl = Math.floor(next / 100) + 1
      if (nextLvl > prevLvl) showToast(`🎉 LEVEL UP! LVL ${nextLvl}!`, 'var(--yellow)')
      if (user) DB.updateUser(user.email, { xp: next, level: nextLvl })
      return next
    })
  }, [user, showToast])

  // Correct answer
  const addCorrect = useCallback(() => {
    setStreak(s => s + 1)
    setCorrect(c => {
      const next = c + 1
      if (user) DB.updateUser(user.email, { correct: next })
      return next
    })
  }, [user])

  const resetStreak = useCallback(() => setStreak(0), [])

  // Save session to history
  const saveHistory = useCallback((session) => {
    if (!user) return
    DB.addHistory(user.email, session)
    DB.updateUser(user.email, { sessions: (user.sessions || 0) + 1 })
  }, [user])

  // Bump msgsSent
  const bumpMsgs = useCallback(() => {
    if (!user) return
    DB.updateUser(user.email, { msgsSent: (user.msgsSent || 0) + 1 })
  }, [user])

  // Update settings
  const updateSetting = useCallback((key, val) => {
    if (key === 'voiceEnabled') setVoiceEnabled(val)
    if (key === 'autoVid') setAutoVid(val)
    if (user) DB.updateUser(user.email, { [key]: val })
  }, [user])

  const updateAvatar = useCallback((av) => {
    setUser(prev => ({ ...prev, avatar: av }))
    if (user) DB.updateUser(user.email, { avatar: av })
  }, [user])

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('hm_session')
    if (saved) {
      try {
        const u = JSON.parse(saved)
        if (u?.email) login(u.email, atob(u.pass || ''))
      } catch {}
    }
  }, [])

  const level = Math.floor(xp / 100) + 1
  const xpProgress = (xp % 100)

  return (
    <AppContext.Provider value={{
      user, xp, streak, correct, level, xpProgress,
      voiceEnabled, autoVid,
      login, signup, logout,
      addXP, addCorrect, resetStreak,
      saveHistory, bumpMsgs,
      updateSetting, updateAvatar,
      showToast, toast,
      DB,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
export { DB }
