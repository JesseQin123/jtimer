import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type AuthTab = 'login' | 'register'

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1F48]"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (activeTab === 'register') {
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致')
        setSubmitting(false)
        return
      }
      if (password.length < 6) {
        setError('密码至少需要6个字符')
        setSubmitting(false)
        return
      }
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 auth-grid z-0"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#FF1F48]/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="w-full max-w-sm text-center relative z-10">
          <div className="w-20 h-20 bg-[#FF1F48]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF1F48]/40">
            <span className="material-icons-round text-4xl text-[#FF1F48]">check</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-wide">注册成功</h2>
          <p className="text-gray-400 mb-8">请检查你的邮箱以确认账户</p>
          <button
            onClick={() => switchTab('login')}
            className="w-full py-4 bg-[#FF1F48] hover:bg-[#ff0033] text-white font-black text-lg shadow-[0_4px_25px_rgba(255,31,72,0.4)] transition-all transform active:scale-[0.98] tracking-widest uppercase -skew-x-[10deg] border-t border-white/20 relative overflow-hidden group"
          >
            <span className="inline-block skew-x-[10deg] flex items-center justify-center gap-2">
              前往登录 <span className="material-icons-round text-xl">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 auth-grid z-0"></div>
        <div className="absolute inset-0 auth-speed-lines z-0"></div>
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#FF1F48]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF1F48]/15 rounded-full blur-[100px]"></div>
      </div>

      <main className="w-full max-w-md flex flex-col items-center justify-center relative z-10">
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center relative auth-float">
          <div className="relative group mb-5">
            <div className="absolute inset-0 bg-[#FF1F48] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="w-28 h-28 bg-[#121212] transform -skew-x-12 border-2 border-[#FF1F48]/60 shadow-[0_0_40px_rgba(255,31,72,0.3)] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
              <span className="material-icons-round text-6xl text-[#FF1F48] transform skew-x-12 drop-shadow-[0_0_15px_rgba(255,31,72,0.9)]">timer</span>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF1F48]"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF1F48]"></div>
            </div>
            <div className="absolute -top-3 -right-6 bg-[#FF1F48] text-white px-2 py-0.5 rounded transform -skew-x-12 text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20">
              Beta
            </div>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl">
            J<span className="text-[#FF1F48]">Timer</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#FF1F48] to-transparent mx-auto mt-2 opacity-80"></div>
          <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mt-3">Professional Fitness Tracker</p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full bg-[#121212] p-1 -skew-x-[10deg] flex mb-10 relative border border-gray-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
          <div
            className={`w-1/2 h-full absolute left-0 top-0 p-1 transition-all duration-300 transform ${activeTab === 'register' ? 'translate-x-full' : 'translate-x-0'} z-0`}
          >
            <div className="w-full h-full bg-[#FF1F48] shadow-[0_0_15px_rgba(255,31,72,0.6)] auth-stripes"></div>
          </div>
          <button
            className={`flex-1 py-3 text-sm font-black italic uppercase relative z-10 text-center transition-colors duration-200 skew-x-[10deg] tracking-wider ${activeTab === 'login' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => switchTab('login')}
          >
            登录
          </button>
          <button
            className={`flex-1 py-3 text-sm font-black italic uppercase relative z-10 text-center transition-colors duration-200 skew-x-[10deg] tracking-wider ${activeTab === 'register' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => switchTab('register')}
          >
            注册
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-[0.2em] flex items-center gap-1">
              <span className="material-icons-round text-[12px] text-[#FF1F48]">mail</span> 邮箱地址
            </label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-4 bg-[#1A1A1A] border-l-[3px] border-gray-700 text-sm focus:outline-none focus:border-[#FF1F48] focus:bg-[#1E1E1E] text-white placeholder-gray-600 transition-all duration-300 rounded-r-md"
                placeholder="runner@jtimer.app"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-[0.2em] flex items-center gap-1">
              <span className="material-icons-round text-[12px] text-[#FF1F48]">lock</span> 密码
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-4 bg-[#1A1A1A] border-l-[3px] border-gray-700 text-sm focus:outline-none focus:border-[#FF1F48] focus:bg-[#1E1E1E] text-white placeholder-gray-600 transition-all duration-300 rounded-r-md pr-12"
                placeholder={activeTab === 'register' ? '至少6个字符' : '••••••••'}
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons-round text-gray-600 text-lg hover:text-white transition-colors">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </div>
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-[0.2em] flex items-center gap-1">
                <span className="material-icons-round text-[12px] text-[#FF1F48]">lock</span> 确认密码
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full px-4 py-4 bg-[#1A1A1A] border-l-[3px] border-gray-700 text-sm focus:outline-none focus:border-[#FF1F48] focus:bg-[#1E1E1E] text-white placeholder-gray-600 transition-all duration-300 rounded-r-md"
                  placeholder="再次输入密码"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 mt-8 bg-[#FF1F48] hover:bg-[#ff0033] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black text-xl shadow-[0_4px_25px_rgba(255,31,72,0.4)] transition-all transform active:scale-[0.98] active:translate-y-1 tracking-widest uppercase italic -skew-x-[10deg] border-t border-white/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[20deg]"></div>
            <span className="inline-block skew-x-[10deg] flex items-center justify-center gap-2">
              {submitting
                ? (activeTab === 'login' ? '登录中...' : '注册中...')
                : (activeTab === 'login' ? '开始训练' : '立即加入')
              }
              {!submitting && <span className="material-icons-round font-bold text-xl">arrow_forward</span>}
            </span>
          </button>

          <div className="flex items-center justify-between pt-2">
            {activeTab === 'login' ? (
              <>
                <a className="text-xs font-semibold text-gray-500 hover:text-white transition-colors uppercase tracking-wide cursor-pointer">
                  忘记密码?
                </a>
                <button
                  type="button"
                  className="text-xs font-bold text-[#FF1F48] hover:text-white transition-colors uppercase tracking-wide flex items-center gap-1"
                  onClick={() => switchTab('register')}
                >
                  创建账号 <span className="material-icons-round text-[12px]">chevron_right</span>
                </button>
              </>
            ) : (
              <>
                <span></span>
                <button
                  type="button"
                  className="text-xs font-bold text-[#FF1F48] hover:text-white transition-colors uppercase tracking-wide flex items-center gap-1"
                  onClick={() => switchTab('login')}
                >
                  已有账号？登录 <span className="material-icons-round text-[12px]">chevron_right</span>
                </button>
              </>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
