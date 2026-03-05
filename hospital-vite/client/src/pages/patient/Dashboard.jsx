import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyAppointments } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

const statusClass = { pending:"badge-pending", confirmed:"badge-confirmed", completed:"badge-completed", cancelled:"badge-cancelled" }

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyAppointments().then(({ data }) => setAppointments(data)).finally(() => setLoading(false))
  }, [])

  const upcoming = appointments.filter(a => ["pending","confirmed"].includes(a.status))
  const completed = appointments.filter(a => a.status === "completed")

  const quickActions = [
    { label: "Book Appointment", icon: "📅", to: "/patient/book",            bg: "bg-blue-50 hover:bg-blue-100",    text: "text-blue-600" },
    { label: "My Appointments",  icon: "🗂",  to: "/patient/appointments",    bg: "bg-emerald-50 hover:bg-emerald-100", text: "text-emerald-600" },
    { label: "AI Symptom Check", icon: "🤖", to: "/patient/symptom-checker", bg: "bg-amber-50 hover:bg-amber-100",  text: "text-amber-600" },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800">Welcome back, {user?.name.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Here's your health overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Upcoming",  val: upcoming.length,   icon: "📅", color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Completed", val: completed.length,  icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total",     val: appointments.length, icon: "📋", color: "text-slate-600",  bg: "bg-slate-50" },
        ].map(({ label, val, icon, color, bg }) => (
          <div key={label} className="card text-center">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{icon}</div>
            <div className={`font-display text-3xl font-bold ${color}`}>{val}</div>
            <div className="text-slate-500 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickActions.map(({ label, icon, to, bg, text }) => (
          <Link key={to} to={to}
            className={`card ${bg} border-0 flex flex-col items-center text-center gap-3 py-6 transition-all hover:shadow-md hover:-translate-y-0.5`}>
            <span className="text-3xl">{icon}</span>
            <span className={`font-semibold ${text}`}>{label}</span>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title mb-0">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-blue-500 text-sm font-semibold hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/></div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="mb-3">No upcoming appointments</p>
            <Link to="/patient/book" className="btn-primary text-sm px-4 py-2">Book Now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0,4).map(appt => (
              <div key={appt._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">👨‍⚕️</div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. {appt.doctor?.user?.name}</p>
                    <p className="text-slate-500 text-sm">{appt.doctor?.specialization} · {new Date(appt.date).toDateString()} · {appt.timeSlot}</p>
                  </div>
                </div>
                <span className={`badge ${statusClass[appt.status]}`}>{appt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
