import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function DashboardPage() {
  const navigate = useNavigate()
  const [city, setCity] = useState('Guwahati')
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
      
      // We check if data.weather.temp is already a string or a number
      const tempVal = data.weather.temp
      const displayTemp = typeof tempVal === 'string' && tempVal.includes('°C') 
        ? tempVal 
        : `${tempVal}°C`

      setWeather({
        city: data.weather.city || city,
        temperature: displayTemp,
        // Dynamic icon based on prediction: 1 is Rain, 0 is Clear
        icon: data.prediction === 1 ? '🌧️' : '☀️',
        description: data.weather.description,
      })

      setForecast(data.forecast || [])
      setPrediction(data.prediction)
      setDecisions(data.decision || [])
      
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
      setError(err.response?.data?.detail || err.message || 'The server is waking up. Please try again in seconds.')
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
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-indigo-100 to-purple-100 px-4 py-6 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Section */}
        <header className="flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/30 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white sm:text-3xl">
              Smart Weather <span className="text-cyan-600 dark:text-cyan-400">AI</span>
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
              Global Insights • ML Predictions • AI Guidance
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="flex h-10 items-center justify-center rounded-2xl border border-white/50 bg-white/80 px-4 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center justify-center rounded-2xl bg-slate-900 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Search & AI Input Section */}
        <section className="rounded-3xl border border-white/40 bg-white/30 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={fetchWeather}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400" htmlFor="city">
                Location
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter city (e.g. Guwahati)"
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-slate-800 shadow-inner outline-none transition focus:ring-2 focus:ring-cyan-500/50 dark:border-slate-700 dark:bg-slate-950/80 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400" htmlFor="query">
                AI Assistant
              </label>
              <input
                id="query"
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask: 'Should I carry an umbrella?'"
                className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-slate-800 shadow-inner outline-none transition focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-950/80 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-cyan-600 px-8 font-bold text-white transition-all hover:bg-cyan-500 active:scale-95 disabled:opacity-50 md:mt-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : 'Analyze Now'}
            </button>
          </form>
          {error && (
            <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}
        </section>

        {weather && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: Live Weather & ML */}
            <div className="space-y-6">
              <article className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/30 p-8 shadow-2xl backdrop-blur-2xl transition hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-slate-900/60">
                <div className="absolute -right-4 -top-4 text-9xl opacity-10 transition-transform group-hover:scale-110">
                  {weather.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Current Station</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                  {weather.city}
                </h2>
                
                <div className="mt-8 flex items-end gap-6">
                  <div className="text-7xl drop-shadow-xl">{weather.icon}</div>
                  <div>
                    <p className="text-5xl font-black text-slate-900 dark:text-white">{weather.temperature}</p>
                    <p className="text-sm font-medium capitalize text-slate-600 dark:text-slate-400">{weather.description}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-6 dark:border-white/5">
                   <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Station Status: <span className="text-emerald-500">Live</span>
                   </div>
                   <div className="text-[10px] font-bold text-slate-400">
                    UPDATED: {lastUpdated}
                   </div>
                </div>
              </article>

              <article className="rounded-3xl border border-white/40 bg-white/30 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ML Prediction Engine</p>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400">SCIKIT-LEARN ACTIVE</span>
                </div>
                
                <div className={`flex items-center gap-4 rounded-2xl p-5 transition-all ${prediction === 1 ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'}`}>
                  <span className="text-3xl">{prediction === 1 ? '🌧️' : '☀️'}</span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{prediction === 1 ? 'Rain Predicted' : 'Clear Skies Ahead'}</p>
                    <p className="text-xs opacity-80">{prediction === 1 ? 'Prepare your umbrella' : 'Perfect for outdoor plans'}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Smart Decision Log</p>
                  <ul className="space-y-3">
                    {decisions.map((decision, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-xl bg-white/40 p-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-white/60 dark:bg-slate-950/40 dark:text-slate-200">
                        <span className="mt-0.5 text-cyan-600">✓</span> {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>

            {/* Right Column: Forecast & AI Chat */}
            <div className="space-y-6">
              <article className="rounded-3xl border border-white/40 bg-white/30 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">5-Day Meteorological Outlook</p>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible">
                  {forecast.length > 0 ? (
                    forecast.map((day, index) => (
                      <div
                        key={index}
                        className="flex min-w-[100px] flex-col items-center rounded-2xl border border-white/50 bg-white/40 p-4 text-center shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white dark:border-white/5 dark:bg-slate-950/40 dark:hover:bg-slate-950/60 md:min-w-0"
                      >
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="my-3 text-2xl">
                          {day.temp > 25 ? '☀️' : day.temp < 15 ? '☁️' : '🌦️'}
                        </p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {typeof day.temp === 'string' ? day.temp.replace('°C', '') : Math.round(day.temp)}°
                        </p>
                        <p className="mt-1 text-[9px] font-bold text-slate-400">{new Date(day.date).getDate()}/{new Date(day.date).getMonth()+1}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-5 py-10 text-center text-xs font-medium text-slate-400">Waiting for data...</div>
                  )}
                </div>
              </article>

              {chatResponse && (
                <article className="relative overflow-hidden rounded-3xl border border-indigo-400/30 bg-indigo-50/50 p-8 shadow-2xl backdrop-blur-2xl dark:border-indigo-500/20 dark:bg-indigo-950/40">
                  <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        AI Neural Response
                      </p>
                    </div>
                    <p className="text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100">
                      "{chatResponse}"
                    </p>
                  </div>
                </article>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default DashboardPage