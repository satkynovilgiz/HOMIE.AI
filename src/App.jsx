import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Toast from './components/ui/Toast.jsx'
import AuthPage from './pages/AuthPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import VoicePage from './pages/VoicePage.jsx'
import VideosPage from './pages/VideosPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LandingPage from './pages/LandingPage.jsx'

function PrivateRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { user, toast } = useApp()
  return (
    <>
      {toast && <Toast msg={toast.msg} color={toast.color} key={toast.id} />}
      {user && <Navbar />}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/home" /> : <AuthPage />} />
          <Route path="/home"    element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/chat"    element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/voice"   element={<PrivateRoute><VoicePage /></PrivateRoute>} />
          <Route path="/videos"  element={<PrivateRoute><VideosPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  )
}
