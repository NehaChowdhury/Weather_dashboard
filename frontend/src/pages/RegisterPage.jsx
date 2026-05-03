import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-indigo-100 to-purple-100 p-4 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 sm:p-10">
          <div className="mb-8 text-center">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-lg shadow-indigo-500/30">
               ✨
             </div>
             <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Create Account</h1>
             <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Join the smart weather revolution today.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-5 py-3.5 text-slate-800 shadow-inner outline-none transition focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-950/80 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-5 py-3.5 text-slate-800 shadow-inner outline-none transition focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-950/80 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-5 py-3.5 text-slate-800 shadow-inner outline-none transition focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-950/80 dark:text-white"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-600 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full h-14 items-center justify-center rounded-2xl bg-indigo-600 px-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : 'Register Now'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/20 pt-6 dark:border-white/10">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="ml-1 text-indigo-600 transition hover:text-indigo-500 dark:text-cyan-400">
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
