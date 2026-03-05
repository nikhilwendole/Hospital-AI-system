import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"

import Home              from "./pages/Home"
import Login             from "./pages/Login"
import Register          from "./pages/Register"
import PatientDashboard  from "./pages/patient/Dashboard"
import BookAppointment   from "./pages/patient/BookAppointment"
import MyAppointments    from "./pages/patient/MyAppointments"
import SymptomChecker    from "./pages/patient/SymptomChecker"
import DoctorDashboard   from "./pages/doctor/Dashboard"
import DoctorSchedule    from "./pages/doctor/Schedule"
import AdminDashboard    from "./pages/admin/Dashboard"
import ManageUsers       from "./pages/admin/ManageUsers"

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient/dashboard"       element={<PrivateRoute roles={["patient"]}><PatientDashboard /></PrivateRoute>} />
        <Route path="/patient/book"            element={<PrivateRoute roles={["patient"]}><BookAppointment /></PrivateRoute>} />
        <Route path="/patient/appointments"    element={<PrivateRoute roles={["patient"]}><MyAppointments /></PrivateRoute>} />
        <Route path="/patient/symptom-checker" element={<PrivateRoute roles={["patient"]}><SymptomChecker /></PrivateRoute>} />

        <Route path="/doctor/dashboard" element={<PrivateRoute roles={["doctor"]}><DoctorDashboard /></PrivateRoute>} />
        <Route path="/doctor/schedule"  element={<PrivateRoute roles={["doctor"]}><DoctorSchedule /></PrivateRoute>} />

        <Route path="/admin/dashboard" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users"     element={<PrivateRoute roles={["admin"]}><ManageUsers /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}
