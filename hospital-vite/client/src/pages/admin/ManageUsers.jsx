import { useState, useEffect } from "react"
import { getAllUsers, deleteUser } from "../../utils/api"

export default function ManageUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const fetch = () => getAllUsers().then(({data})=>setUsers(data)).finally(()=>setLoading(false))
  useEffect(() => { fetch() }, [])

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return
    await deleteUser(id); fetch()
  }

  const ROLE_BADGE = { patient:"badge-patient", doctor:"badge-doctor", admin:"badge-admin" }

  const filtered = users
    .filter(u => filter==="all" || u.role===filter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="page-title">👥 Manage Users</h1>
        <p className="text-slate-500">View and manage all registered users</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input-field max-w-xs" placeholder="🔍 Search by name or email..."
          value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {["all","patient","doctor","admin"].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${filter===f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {f}s ({f==="all"?users.length:users.filter(u=>u.role===f).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"/></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["User","Email","Role","Phone","Joined","Action"].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{u.email}</td>
                  <td className="px-5 py-3.5"><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{u.phone||"—"}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    {u.role!=="admin" && (
                      <button onClick={()=>handleDelete(u._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div className="text-center py-10 text-slate-400">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
