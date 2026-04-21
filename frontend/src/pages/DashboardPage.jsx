import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function DashboardPage() {
  const navigate = useNavigate()
  const [city, setCity] = useState('London')
  const [chatInput, setChatInput] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  const [forecast, setForecast] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [decisions, setDecisions] = useState([])
  const [chatResponse, setChatResponse] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/login')
    } else {
      fetchWeather() // Optional: auto-fetch on mount if desired, but waiting for user input is fine too. We'll leave it out for simplicity or we can add it later.
    }
  }, [navigate])

  const fetchWeather = async (e) => {
    if (e) e.preventDefault()
    if (!city.trim()) return
    setError('')
    setLoading(true)
    try {
      const response = await api.get('/weather', { params: { city, query: chatInput } })
      const data = response.data
      
      setWeather({
        city: data.weather.city,
        temperature: `${data.weather.temp}°C`,
        icon: '⛅',
        description: data.weather.description,
      })

      setForecast(data.forecast)
      setPrediction(data.prediction)
      setDecisions(data.decision)
      
      if (chatInput.trim() !== '') {
         setChatResponse(data.chat_response)
      } else {
         setChatResponse('')
      }
      
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_email')
        navigate('/login')
        return
      }
      setError(err.response?.data?.detail || 'Could not fetch weather')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_email')
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-200 via-indigo-200 to-purple-200 px-4 py-8 transition dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Smart Weather AI</h1>
            <p className="text-sm text-slate-700 dark:text-slate-300">Track your city weather globally with AI predictions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="rounded-2xl border border-white/30 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="rounded-3xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={fetchWeather}>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="city">
                Search City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter city name..."
                className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="query">
                Ask Chatbot
              </label>
              <input
                id="query"
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="e.g. Should I take an umbrella?"
                className="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50 sm:w-auto"
              >
                {loading ? 'Thinking...' : 'Analyze'}
              </button>
            </div>
          </form>
          {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </section>

        {weather && (
          <div className="grid gap-6 md:grid-cols-2">
            <section className="space-y-6">
              <article className="rounded-3xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
                <p className="text-sm text-slate-700 dark:text-slate-300">Live Conditions</p>
                <h2 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">
                  {weather.city}
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-6xl">{weather.icon}</p>
                  <p className="text-sm capitalize text-slate-700 dark:text-slate-300">{weather.description}</p>
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="flex-1 rounded-2xl bg-white/60 p-4 dark:bg-slate-950/60">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Temperature</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{weather.temperature}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                  Last updated: {lastUpdated}
                </div>
              </article>

              <article className="rounded-3xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">ML Prediction engine</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-xl font-bold flex-1 text-center ${prediction === 1 ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'}`}>
                    {prediction === 1 ? '🌧️ RAIN PREDICTED' : '☀️ NO RAIN PREDICTED'}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">Smart Decision Advice:</p>
                <ul className="space-y-2">
                  {decisions.map((decision, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <span className="text-cyan-600 dark:text-cyan-400">★</span> {decision}
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="space-y-6 flex flex-col">
              <article className="rounded-3xl border border-white/30 bg-white/20 p-6 shadow-xl backdrop-blur-xl dark:border-white/20 dark:bg-slate-900/40">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">5-day forecast</p>
                <div className="grid grid-cols-5 gap-2">
                  {forecast.length > 0 ? (
                    forecast.map((day, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/30 bg-white/30 p-2 text-center backdrop-blur-md transition hover:scale-105 dark:border-white/15 dark:bg-slate-900/40"
                      >
                        <p className="text-[10px] text-slate-700 dark:text-slate-300">{new Date(day.date).getDate()}/{new Date(day.date).getMonth()+1}</p>
                        <p className="text-xl my-1">🌡️</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round(day.temp)}°</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-5 text-sm text-center text-slate-500">No forecast data.</div>
                  )}
                </div>
              </article>

              {chatResponse && (
                <article className="flex-1 rounded-3xl border border-indigo-300/50 bg-indigo-50/50 p-6 shadow-xl backdrop-blur-xl dark:border-indigo-500/20 dark:bg-indigo-950/30 flex flex-col justify-center">
                   <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3 block">
                     AI Assistant Response
                   </p>
                   <p className="text-lg text-slate-800 dark:text-slate-100 italic leading-relaxed">
                     "{chatResponse}"
                   </p>
                </article>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

export default DashboardPage