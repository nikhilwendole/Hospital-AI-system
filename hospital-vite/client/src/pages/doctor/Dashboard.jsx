import { useState, useEffect } from "react"
import { getDoctorAppointments, updateAppointment } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [selected, setSelected]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const [rx, setRx] = useState({ medicines:[{name:"",dosage:"",duration:""}], instructions:"" })

  const fetch = () => getDoctorAppointments().then(({data})=>setAppointments(data)).finally(()=>setLoading(false))
  useEffect(() => { fetch() }, [])

  const today    = appointments.filter(a => new Date(a.date).toDateString()===new Date().toDateString())
  const pending  = appointments.filter(a => a.status==="pending")

  const handleComplete = async (id) => {
    await updateAppointment(id, { status:"completed", prescription:rx })
    setSelected(null); fetch()
  }

  const addMed = () => setRx({...rx, medicines:[...rx.medicines,{name:"",dosage:"",duration:""}]})
  const updateMed = (i,k,v) => { const m=[...rx.medicines]; m[i][k]=v; setRx({...rx,medicines:m}) }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800">Welcome, Dr. {user?.name.split(" ").slice(-1)[0]} 👨‍⚕️</h1>
        <p className="text-slate-500 mt-1">Your practice dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {label:"Today",    val:today.length,        icon:"🗓",  bg:"bg-blue-50",    text:"text-blue-600"},
          {label:"Pending",  val:pending.length,      icon:"⏳",  bg:"bg-amber-50",   text:"text-amber-600"},
          {label:"Total",    val:appointments.length, icon:"📋",  bg:"bg-slate-50",   text:"text-slate-600"},
        ].map(({label,val,icon,bg,text}) => (
          <div key={label} className="card text-center">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{icon}</div>
            <div className={`font-display text-3xl font-bold ${text}`}>{val}</div>
            <div className="text-slate-500 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <h2 className="section-title">Today's Appointments</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/></div>
        ) : today.length===0 ? (
          <div className="text-center py-10 text-slate-400"><div className="text-4xl mb-3">🌿</div><p>No appointments today</p></div>
        ) : (
          <div className="space-y-3">
            {today.map(appt => (
              <div key={appt._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-xl">🧑</div>
                  <div>
                    <p className="font-semibold text-slate-800">{appt.patient?.name}</p>
                    <p className="text-slate-500 text-sm">⏰ {appt.timeSlot} · Age {appt.patient?.age||"N/A"} · {appt.patient?.gender||""}</p>
                    {appt.symptoms && <p className="text-slate-600 text-sm mt-1">🩺 {appt.symptoms}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${appt.status==="completed"?"badge-completed":"badge-pending"}`}>{appt.status}</span>
                  {appt.status!=="completed" && (
                    <button onClick={()=>setSelected(appt)} className="btn-primary text-sm px-3 py-2">
                      Prescribe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-modal mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-bold text-slate-800 mb-6">📋 Prescription for {selected.patient?.name}</h3>
            <div className="space-y-3 mb-4">
              {rx.medicines.map((med,i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <input className="input-field text-sm" placeholder="Medicine" value={med.name} onChange={e=>updateMed(i,"name",e.target.value)} />
                  <input className="input-field text-sm" placeholder="Dosage" value={med.dosage} onChange={e=>updateMed(i,"dosage",e.target.value)} />
                  <input className="input-field text-sm" placeholder="Duration" value={med.duration} onChange={e=>updateMed(i,"duration",e.target.value)} />
                </div>
              ))}
            </div>
            <button onClick={addMed} className="text-blue-500 text-sm font-semibold mb-4 hover:underline">+ Add Medicine</button>
            <textarea className="input-field resize-none mb-6" rows={3} placeholder="Additional instructions..."
              value={rx.instructions} onChange={e=>setRx({...rx,instructions:e.target.value})} />
            <div className="flex gap-3 justify-end">
              <button onClick={()=>setSelected(null)} className="btn-secondary">Cancel</button>
              <button onClick={()=>handleComplete(selected._id)} className="btn-success">Mark Complete ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
