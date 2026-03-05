const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Get all doctors (public)
const getAllDoctors = async (req, res) => {
  try {
    const { department, specialization } = req.query;
    let filter = { isAvailable: true };
    if (department) filter.department = department;
    if (specialization) filter.specialization = new RegExp(specialization, "i");

    const doctors = await Doctor.find(filter).populate("user", "name email profilePic");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phone"
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Doctor: Update own profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create doctor profile
const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, department, experience, fees, availableDays, availableTime, bio } = req.body;
    const doctor = await Doctor.create({
      user: userId,
      specialization,
      department,
      experience,
      fees,
      availableDays,
      availableTime,
      bio,
    });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctorProfile, createDoctor };
