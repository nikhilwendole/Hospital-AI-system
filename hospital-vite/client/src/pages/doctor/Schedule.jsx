import { useState, useEffect } from "react"
import { getDoctorAppointments } from "../../utils/api"

const STATUS = { pending:"badge-pending", confirmed:"badge-confirmed", completed:"badge-completed", cancelled:"badge-cancelled" }

export default function DoctorSchedule() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoctorAppointments().then(({data})=>setAppointments(data)).finally(()=>setLoading(false))
  }, [])

  const grouped = appointments.reduce((acc, a) => {
    const key = new Date(a.date).toDateString()
    if (!acc[key]) acc[key] = []
    acc[key].push(a)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="page-title">📅 My Schedule</h1>
        <p className="text-slate-500">All your upcoming and past appointments</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/></div>
      ) : Object.keys(grouped).length===0 ? (
        <div className="card text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p>No appointments scheduled</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-slate-200"/>
              <span className="font-display font-semibold text-slate-600 text-sm px-3 py-1 bg-slate-100 rounded-full">{date}</span>
              <div className="h-px flex-1 bg-slate-200"/>
            </div>
            <div className="space-y-3">
              {appts.sort((a,b)=>a.timeSlot.localeCompare(b.timeSlot)).map(appt => (
                <div key={appt._id} className="card flex items-center gap-4">
                  <div className="text-blue-600 font-bold font-display text-lg w-14 text-center flex-shrink-0">{appt.timeSlot}</div>
                  <div className="w-px h-10 bg-slate-200 flex-shrink-0"/>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">🧑</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{appt.patient?.name}</p>
                    <p className="text-slate-500 text-sm">Age: {appt.patient?.age||"N/A"} · {appt.patient?.gender||""}</p>
                    {appt.symptoms && <p className="text-slate-600 text-sm mt-1">🩺 {appt.symptoms}</p>}
                  </div>
                  <span className={`badge ${STATUS[appt.status]}`}>{appt.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
