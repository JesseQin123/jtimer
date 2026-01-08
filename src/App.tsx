import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import History from './pages/History'
import Stats from './pages/Stats'
import Timer from './pages/Timer'
import Auth from './pages/Auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <>
    <Analytics />
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="history" element={<History />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      <Route
        path="/timer/:type"
        element={
          <ProtectedRoute>
            <Timer />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  )
}

export default App
