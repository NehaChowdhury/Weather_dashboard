import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const response = await api.post('/auth/login', form)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('user_email', response.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-300 via-indigo-300 to-purple-300 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <section className="w-full max-w-md rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
        <h1 className="mb-2 text-3xl font-semibold text-slate-800 dark:text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">Sign in to view your weather dashboard.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            required
          />
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300">
          New here?{' '}
          <Link to="/register" className="font-semibold text-indigo-700 dark:text-cyan-400">
            Create account
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
