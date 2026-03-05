const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// Patient: Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
      symptoms,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Patient: Get my appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Patient: Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (appt.patient.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    appt.status = "cancelled";
    await appt.save();
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Doctor: Get my schedule
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone age gender")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Doctor: Update appointment (complete + add prescription)
const updateAppointment = async (req, res) => {
  try {
    const { status, notes, prescription } = req.body;
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes, prescription },
      { new: true }
    );
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointment,
  getAllAppointments,
};
