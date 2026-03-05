import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const handleLogout = () => { logout(); navigate("/login") }
  const active = (path) => location.pathname.startsWith(path)

  const patientLinks = [
    { to: "/patient/dashboard",       label: "Dashboard",     icon: "⊞" },
    { to: "/patient/book",            label: "Book",          icon: "📅" },
    { to: "/patient/appointments",    label: "Appointments",  icon: "🗂" },
    { to: "/patient/symptom-checker", label: "AI Checker",    icon: "🤖" },
  ]
  const doctorLinks = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: "⊞" },
    { to: "/doctor/schedule",  label: "Schedule",  icon: "📋" },
  ]
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
    { to: "/admin/users",     label: "Users",     icon: "👥" },
  ]
  const links = user?.role === "patient" ? patientLinks
              : user?.role === "doctor"  ? doctorLinks
              : user?.role === "admin"   ? adminLinks : []

  const roleColors = { patient: "bg-blue-500", doctor: "bg-emerald-500", admin: "bg-purple-500" }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-navy-900 to-navy-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform">🏥</div>
          <span className="text-white font-display font-bold text-xl tracking-tight">MediCare</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {!user ? (
            <>
              <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active("/") && location.pathname === "/" ? "bg-white/15 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"}`}>Home</Link>
              <Link to="/login" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active("/login") ? "bg-white/15 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"}`}>Login</Link>
              <Link to="/register" className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg">Register Free</Link>
            </>
          ) : (
            <>
              {links.map(({ to, label, icon }) => (
                <Link key={to} to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${active(to) ? "bg-white/15 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"}`}>
                  <span className="text-xs">{icon}</span>{label}
                </Link>
              ))}
              <div className="ml-3 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                <span className={`${roleColors[user.role]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>{user.role}</span>
                <span className="text-white text-sm font-medium">{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={handleLogout} className="ml-2 px-3 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
