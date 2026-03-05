const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");
const { protect, roleCheck } = require("../middleware/auth");

router.post("/", protect, roleCheck("patient"), bookAppointment);
router.get("/my", protect, roleCheck("patient"), getMyAppointments);
router.put("/:id/cancel", protect, roleCheck("patient"), cancelAppointment);
router.get("/doctor", protect, roleCheck("doctor"), getDoctorAppointments);
router.put("/:id", protect, roleCheck("doctor"), updateAppointment);
router.get("/all", protect, roleCheck("admin"), getAllAppointments);

module.exports = router;
