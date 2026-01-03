import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { path: '/', icon: 'timer', label: '计时' },
  { path: '/history', icon: 'history', label: '记录' },
  { path: '/stats', icon: 'stats', label: '统计' },
]

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? 'text-cyan-400' : 'text-slate-400'

  switch (icon) {
    case 'timer':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="13" r="8" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 9v4l2 2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 5V3" />
          <path strokeLinecap="round" strokeWidth="2" d="M9 2h6" />
        </svg>
      )
    case 'history':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'stats':
      return (
        <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    default:
      return null
  }
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Timer4Sport</h1>
        <button
          onClick={() => signOut()}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          登出
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto no-scrollbar">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-6 py-2 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <NavIcon icon={item.icon} active={isActive} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
