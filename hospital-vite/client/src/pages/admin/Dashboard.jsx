import { useState, useEffect } from "react"
import { getAdminStats, getAllAppointments } from "../../utils/api"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444"]
const STATUS = { pending:"badge-pending", confirmed:"badge-confirmed", completed:"badge-completed", cancelled:"badge-cancelled" }

export default function AdminDashboard() {
  const [stats, setStats]             = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([getAdminStats(), getAllAppointments()])
      .then(([s,a]) => { setStats(s.data); setAppointments(a.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/>
    </div>
  )

  const pieData = [
    { name:"Pending",   value: stats?.pendingAppointments||0 },
    { name:"Completed", value: stats?.completedAppointments||0 },
    { name:"Others",    value: (stats?.totalAppointments||0)-(stats?.pendingAppointments||0)-(stats?.completedAppointments||0) },
  ].filter(d=>d.value>0)

  const statCards = [
    { label:"Total Patients",      val:stats?.totalPatients,      icon:"👥", bg:"bg-blue-50",    text:"text-blue-600"    },
    { label:"Total Doctors",       val:stats?.totalDoctors,       icon:"👨‍⚕️", bg:"bg-emerald-50", text:"text-emerald-600" },
    { label:"Total Appointments",  val:stats?.totalAppointments,  icon:"📅", bg:"bg-amber-50",   text:"text-amber-600"   },
    { label:"Pending",             val:stats?.pendingAppointments,icon:"⏳", bg:"bg-red-50",     text:"text-red-500"     },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 fade-in">
      <div className="mb-8">
        <h1 className="page-title">🛡 Admin Dashboard</h1>
        <p className="text-slate-500">System overview and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({label,val,icon,bg,text}) => (
          <div key={label} className="card text-center">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>{icon}</div>
            <div className={`font-display text-3xl font-bold ${text}`}>{val??0}</div>
            <div className="text-slate-500 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="section-title">📈 Appointments — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.last7Days||[]}>
              <XAxis dataKey="_id" tick={{fontSize:11}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="section-title">🥧 Appointment Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend /><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="section-title mb-0">📋 Recent Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["Patient","Doctor","Date","Time","Status"].map(h=>(
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0,8).map(appt => (
                <tr key={appt._id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{appt.patient?.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">Dr. {appt.doctor?.user?.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{appt.timeSlot}</td>
                  <td className="px-5 py-3"><span className={`badge ${STATUS[appt.status]}`}>{appt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
