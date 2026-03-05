import { Link } from "react-router-dom"

const departments = [
  { name: "General Medicine", icon: "🩺", desc: "Routine checkups & common illnesses" },
  { name: "Cardiology",       icon: "❤️", desc: "Heart & cardiovascular care" },
  { name: "Orthopedics",      icon: "🦴", desc: "Bone, joint & muscle disorders" },
  { name: "Neurology",        icon: "🧠", desc: "Brain & nervous system" },
  { name: "Pediatrics",       icon: "👶", desc: "Child health & development" },
  { name: "Dermatology",      icon: "🌿", desc: "Skin, hair & nail conditions" },
]

const stats = [
  { num: "500+", label: "Doctors" },
  { num: "10K+", label: "Patients" },
  { num: "15+",  label: "Departments" },
  { num: "24/7", label: "AI Support" },
]

export default function Home() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🤖 AI-Powered Hospital Management
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your Health,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Our Priority</span>
          </h1>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Book appointments with top doctors, get AI-powered symptom guidance, and manage your health records — all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 text-lg">
              Get Started Free →
            </Link>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl transition-all text-lg backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold text-blue-600">{num}</div>
              <div className="text-slate-500 text-sm mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Our Departments</h2>
          <p className="text-slate-500 text-lg">Expert care across all medical specialties</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <Link key={dept.name} to="/patient/book"
              className="group card hover:border-blue-200 hover:shadow-md transition-all duration-200 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                {dept.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{dept.name}</h3>
                <p className="text-slate-500 text-sm">{dept.desc}</p>
                <span className="text-blue-500 text-sm font-medium group-hover:gap-2 transition-all mt-2 inline-flex items-center gap-1">Book Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Feature Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="text-7xl">🤖</div>
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold mb-3">AI Symptom Checker</h2>
            <p className="text-blue-100 text-lg mb-6">Describe your symptoms and our AI will instantly recommend the right department and specialist to visit.</p>
            <Link to="/patient/symptom-checker" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5">
              Try AI Checker →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-6 text-sm">
        © 2025 MediCare Hospital Management System — Built with MERN + Vite + AI
      </footer>
    </div>
  )
}
