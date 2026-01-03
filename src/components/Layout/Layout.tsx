import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/stats', icon: 'leaderboard', label: '统计' },
  { path: '/achievements', icon: 'emoji_events', label: '成就' },
  { path: '/settings', icon: 'settings', label: '设置' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path: string) => {
    // Only navigate for implemented pages
    if (path === '/' || path === '/stats' || path === '/history') {
      navigate(path)
    }
    // For achievements and settings, do nothing for now
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background glow effects */}
      <div className="fixed top-[-20%] left-[-20%] w-[60%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main content */}
      <main className="flex-1 overflow-auto no-scrollbar pb-24 relative z-10">
        <Outlet />
      </main>

      {/* Bottom navigation - 4 tabs */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 safe-area-bottom">
        <div className="flex justify-between items-start h-24 max-w-lg mx-auto px-6">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const isImplemented = item.path === '/' || item.path === '/stats' || item.path === '/history'
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center gap-1.5 pt-3 w-16 transition-colors ${
                  isActive ? 'text-primary' : isImplemented ? 'text-text-secondary hover:text-white' : 'text-text-tertiary'
                }`}
              >
                <span className={`material-icons-round text-2xl ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
