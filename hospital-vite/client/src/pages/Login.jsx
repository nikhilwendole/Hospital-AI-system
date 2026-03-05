import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" })
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const { data } = await loginUser(form)
      login(data)
      navigate(`/${data.role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password")
    } finally { setLoading(false) }
  }

  const quickFill = (email, pw) => setForm({ email, password: pw })

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-modal overflow-hidden flex fade-in">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center w-5/12 bg-gradient-to-b from-navy-800 to-navy-900 text-white p-10">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">🏥</div>
          <h2 className="font-display text-3xl font-bold mb-3">MediCare</h2>
          <p className="text-blue-200 mb-8 leading-relaxed">Your trusted hospital management platform. Book appointments, consult doctors, get AI guidance.</p>
          <div className="space-y-3">
            {["Instant appointment booking","AI symptom checker","Prescription history","Role-based dashboards"].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100 text-sm">
                <div className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-10">
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-1">Welcome back 👋</h2>
          <p className="text-slate-500 mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input className="input-field" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Quick Demo */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">🚀 Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: "Admin",   email: "admin@hospital.com",  pw: "admin123",   color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" },
                { role: "Doctor",  email: "priya@hospital.com",  pw: "doctor123",  color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200" },
                { role: "Patient", email: "rohan@gmail.com",     pw: "patient123", color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" },
              ].map(({ role, email, pw, color }) => (
                <button key={role} onClick={() => quickFill(email, pw)}
                  className={`border ${color} text-xs font-bold py-2 rounded-xl transition-all`}>
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            No account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
