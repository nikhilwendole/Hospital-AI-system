const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  createDoctor,
} = require("../controllers/doctorController");
const { protect, roleCheck } = require("../middleware/auth");

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.put("/profile", protect, roleCheck("doctor"), updateDoctorProfile);
router.post("/", protect, roleCheck("admin"), createDoctor);

module.exports = router;
