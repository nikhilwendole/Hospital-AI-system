import axios from "axios"

// const API = axios.create({ baseURL: "/api" })
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("hospitalUser") || "{}")
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

export const registerUser      = (d) => API.post("/auth/register", d)
export const loginUser         = (d) => API.post("/auth/login", d)
export const getProfile        = ()  => API.get("/auth/profile")

export const bookAppointment      = (d)  => API.post("/appointments", d)
export const getMyAppointments    = ()   => API.get("/appointments/my")
export const cancelAppointment    = (id) => API.put(`/appointments/${id}/cancel`)
export const getDoctorAppointments= ()   => API.get("/appointments/doctor")
export const updateAppointment    = (id, d) => API.put(`/appointments/${id}`, d)
export const getAllAppointments    = ()   => API.get("/appointments/all")

export const getAllDoctors      = (p) => API.get("/doctors", { params: p })
export const getDoctorById     = (id)=> API.get(`/doctors/${id}`)
export const updateDoctorProfile=(d) => API.put("/doctors/profile", d)

export const getAdminStats     = ()   => API.get("/admin/stats")
export const getAllUsers        = ()   => API.get("/admin/users")
export const deleteUser        = (id) => API.delete(`/admin/users/${id}`)

export const checkSymptoms     = (d)  => API.post("/ai/symptom-check", d)

export default API
