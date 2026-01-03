import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/history', icon: 'history', label: '记录' },
  { path: '/stats', icon: 'leaderboard', label: '统计' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Background glow effects */}
      <div className="fixed top-[-20%] left-[-20%] w-[60%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main content */}
      <main className="flex-1 overflow-auto no-scrollbar pb-24 relative z-10">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1.5 py-2 px-6 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-white'
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
