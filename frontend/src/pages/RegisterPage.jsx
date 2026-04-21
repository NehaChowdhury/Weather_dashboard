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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fuchsia-300 via-violet-300 to-sky-300 p-6 dark:from-slate-950 dark:via-violet-950 dark:to-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
        <h1 className="mb-2 text-3xl font-semibold text-slate-800 dark:text-white">Create account</h1>
        <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">Get started with your personalized weather dashboard.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            required
            minLength={6}
          />
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-700 dark:text-cyan-400">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
