import { useState, useEffect } from "react"
import { getAllDoctors, bookAppointment } from "../../utils/api"
import { useNavigate } from "react-router-dom"

const SLOTS = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"]
const DEPTS = ["All","General Medicine","Cardiology","Orthopedics","Neurology","Pediatrics","Dermatology","ENT"]

export default function BookAppointment() {
  const [doctors, setDoctors]         = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [form, setForm]               = useState({ date:"", timeSlot:"", symptoms:"" })
  const [dept, setDept]               = useState("All")
  const [success, setSuccess]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAllDoctors(dept !== "All" ? { department: dept } : {}).then(({ data }) => setDoctors(data))
  }, [dept])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!selectedDoc) return alert("Please select a doctor")
    if (!form.timeSlot) return alert("Please select a time slot")
    setLoading(true)
    try {
      await bookAppointment({ doctorId: selectedDoc._id, ...form })
      setSuccess(true)
      setTimeout(() => navigate("/patient/appointments"), 2000)
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed")
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center fade-in">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="font-display text-2xl font-bold text-emerald-600 mb-2">Appointment Booked!</h2>
      <p className="text-slate-500">Redirecting to your appointments...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="page-title">📅 Book an Appointment</h1>
        <p className="text-slate-500">Choose a doctor and pick a time slot</p>
      </div>

      {/* Department Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {DEPTS.map(d => (
          <button key={d} onClick={() => setDept(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${dept===d ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor List */}
        <div>
          <h2 className="section-title">Select a Doctor</h2>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {doctors.length === 0 ? (
              <div className="card text-center text-slate-400 py-10">No doctors found</div>
            ) : doctors.map(doc => (
              <div key={doc._id} onClick={() => setSelectedDoc(doc)}
                className={`card cursor-pointer transition-all hover:shadow-md ${selectedDoc?._id===doc._id ? "border-2 border-blue-500 bg-blue-50" : "hover:border-blue-200"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Dr. {doc.user?.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{doc.specialization}</p>
                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs">
                      <span>💰 ₹{doc.fees}</span>
                      <span>⭐ {doc.experience} yrs</span>
                      <span>🏥 {doc.department}</span>
                    </div>
                  </div>
                  {selectedDoc?._id===doc._id && <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <h2 className="section-title">Appointment Details</h2>
          {!selectedDoc ? (
            <div className="card text-center text-slate-400 py-16 border-2 border-dashed">
              <div className="text-4xl mb-3">👈</div>
              <p>Select a doctor first</p>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👨‍⚕️</div>
                <div>
                  <p className="font-semibold text-slate-800">Dr. {selectedDoc.user?.name}</p>
                  <p className="text-blue-600 text-sm">{selectedDoc.specialization} · ₹{selectedDoc.fees}</p>
                </div>
              </div>
              <form onSubmit={handleBook} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                  <input className="input-field" type="date" value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e=>setForm({...form,date:e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time Slot</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SLOTS.map(t => (
                      <button key={t} type="button" onClick={() => setForm({...form,timeSlot:t})}
                        className={`py-2 text-sm rounded-lg border font-medium transition-all ${form.timeSlot===t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Symptoms <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Describe your symptoms..."
                    value={form.symptoms} onChange={e=>setForm({...form,symptoms:e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-60">
                  {loading ? "Booking..." : "Confirm Appointment ✓"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
