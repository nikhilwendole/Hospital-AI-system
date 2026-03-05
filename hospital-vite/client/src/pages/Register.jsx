import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"patient", phone:"", age:"", gender:"male" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const { data } = await registerUser(form)
      login(data)
      navigate(`/${data.role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally { setLoading(false) }
  }
  const f = (k, v) => setForm({ ...form, [k]: v })

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-modal p-10 fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏥</div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-1">Join MediCare today</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input className="input-field" type="text" placeholder="John Doe" value={form.name} onChange={e=>f("name",e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e=>f("email",e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>f("password",e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <input className="input-field" type="tel" placeholder="9999999999" value={form.phone} onChange={e=>f("phone",e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
              <input className="input-field" type="number" placeholder="25" value={form.age} onChange={e=>f("age",e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
              <select className="input-field" value={form.gender} onChange={e=>f("gender",e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
              <select className="input-field" value={form.role} onChange={e=>f("role",e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base mt-2 disabled:opacity-60">
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
