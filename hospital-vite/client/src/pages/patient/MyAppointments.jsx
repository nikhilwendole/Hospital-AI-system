import { useState, useEffect } from "react"
import { getMyAppointments, cancelAppointment } from "../../utils/api"

const STATUS = { pending:"badge-pending", confirmed:"badge-confirmed", completed:"badge-completed", cancelled:"badge-cancelled" }

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetch = () => getMyAppointments().then(({data})=>setAppointments(data)).finally(()=>setLoading(false))
  useEffect(() => { fetch() }, [])

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return
    await cancelAppointment(id); fetch()
  }

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="page-title">🗂 My Appointments</h1>
        <p className="text-slate-500">Track and manage your appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all","pending","confirmed","completed","cancelled"].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${filter===f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
            {f} ({f==="all" ? appointments.length : appointments.filter(a=>a.status===f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => (
            <div key={appt._id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">👨‍⚕️</div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Dr. {appt.doctor?.user?.name}</h3>
                    <p className="text-blue-600 text-sm">{appt.doctor?.specialization} · {appt.doctor?.department}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-slate-500 text-sm">
                      <span>📅 {new Date(appt.date).toDateString()}</span>
                      <span>⏰ {appt.timeSlot}</span>
                    </div>
                    {appt.symptoms && <p className="text-slate-600 text-sm mt-2 bg-slate-50 px-3 py-1.5 rounded-lg">🩺 {appt.symptoms}</p>}
                  </div>
                </div>
                <span className={`badge ${STATUS[appt.status]}`}>{appt.status}</span>
              </div>

              {/* Prescription */}
              {appt.prescription?.medicines?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="font-semibold text-slate-700 text-sm mb-2">📋 Prescription</p>
                  <div className="bg-emerald-50 rounded-xl p-3 space-y-1">
                    {appt.prescription.medicines.map((m,i) => (
                      <p key={i} className="text-sm text-slate-700">💊 <strong>{m.name}</strong> — {m.dosage} for {m.duration}</p>
                    ))}
                    {appt.prescription.instructions && (
                      <p className="text-sm text-slate-600 mt-2 pt-2 border-t border-emerald-100">📝 {appt.prescription.instructions}</p>
                    )}
                  </div>
                </div>
              )}

              {["pending","confirmed"].includes(appt.status) && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button onClick={()=>handleCancel(appt._id)}
                    className="text-sm text-red-600 font-semibold hover:underline">Cancel Appointment</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
