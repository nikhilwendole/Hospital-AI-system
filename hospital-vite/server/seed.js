const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB ✅");

  // Clear existing data
  await User.deleteMany();
  await Doctor.deleteMany();
  await Appointment.deleteMany();
  console.log("Cleared old data 🗑️");

  const hash = (pw) => bcrypt.hash(pw, 10);

  // ── Create Users ──────────────────────────────────────────
  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@hospital.com",
    password: await hash("admin123"),
    role: "admin",
    phone: "9000000001",
    age: 35,
    gender: "male",
  });

  const doctorUsers = await User.insertMany([
    { name: "Dr. Priya Sharma",   email: "priya@hospital.com",   password: await hash("doctor123"), role: "doctor", phone: "9000000002", age: 42, gender: "female" },
    { name: "Dr. Arjun Mehta",    email: "arjun@hospital.com",   password: await hash("doctor123"), role: "doctor", phone: "9000000003", age: 38, gender: "male"   },
    { name: "Dr. Sneha Patil",    email: "sneha@hospital.com",   password: await hash("doctor123"), role: "doctor", phone: "9000000004", age: 45, gender: "female" },
    { name: "Dr. Rahul Desai",    email: "rahul@hospital.com",   password: await hash("doctor123"), role: "doctor", phone: "9000000005", age: 50, gender: "male"   },
    { name: "Dr. Kavita Nair",    email: "kavita@hospital.com",  password: await hash("doctor123"), role: "doctor", phone: "9000000006", age: 36, gender: "female" },
    { name: "Dr. Vikram Singh",   email: "vikram@hospital.com",  password: await hash("doctor123"), role: "doctor", phone: "9000000007", age: 55, gender: "male"   },
  ]);

  const patientUsers = await User.insertMany([
    { name: "Rohan Kulkarni",  email: "rohan@gmail.com",  password: await hash("patient123"), role: "patient", phone: "9111111001", age: 28, gender: "male"   },
    { name: "Anjali Joshi",    email: "anjali@gmail.com", password: await hash("patient123"), role: "patient", phone: "9111111002", age: 32, gender: "female" },
    { name: "Suresh Yadav",    email: "suresh@gmail.com", password: await hash("patient123"), role: "patient", phone: "9111111003", age: 45, gender: "male"   },
    { name: "Meera Iyer",      email: "meera@gmail.com",  password: await hash("patient123"), role: "patient", phone: "9111111004", age: 25, gender: "female" },
    { name: "Aditya Bansal",   email: "aditya@gmail.com", password: await hash("patient123"), role: "patient", phone: "9111111005", age: 60, gender: "male"   },
  ]);

  // ── Create Doctor Profiles ─────────────────────────────────
  const doctors = await Doctor.insertMany([
    {
      user: doctorUsers[0]._id,
      specialization: "Cardiologist",
      department: "Cardiology",
      experience: 15,
      fees: 800,
      availableDays: ["Monday", "Wednesday", "Friday"],
      availableTime: { start: "09:00", end: "17:00" },
      bio: "Expert in heart diseases with 15+ years of experience.",
    },
    {
      user: doctorUsers[1]._id,
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      experience: 12,
      fees: 700,
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      availableTime: { start: "10:00", end: "18:00" },
      bio: "Specialist in bone and joint disorders.",
    },
    {
      user: doctorUsers[2]._id,
      specialization: "Neurologist",
      department: "Neurology",
      experience: 18,
      fees: 1000,
      availableDays: ["Monday", "Tuesday", "Friday"],
      availableTime: { start: "09:00", end: "16:00" },
      bio: "Leading neurologist specializing in brain and nerve disorders.",
    },
    {
      user: doctorUsers[3]._id,
      specialization: "General Physician",
      department: "General Medicine",
      experience: 22,
      fees: 400,
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTime: { start: "08:00", end: "17:00" },
      bio: "Experienced general physician for all common ailments.",
    },
    {
      user: doctorUsers[4]._id,
      specialization: "Dermatologist",
      department: "Dermatology",
      experience: 10,
      fees: 600,
      availableDays: ["Wednesday", "Thursday", "Saturday"],
      availableTime: { start: "11:00", end: "19:00" },
      bio: "Skin specialist with expertise in all dermatological conditions.",
    },
    {
      user: doctorUsers[5]._id,
      specialization: "Pediatrician",
      department: "Pediatrics",
      experience: 20,
      fees: 500,
      availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
      availableTime: { start: "09:00", end: "15:00" },
      bio: "Child health specialist with 20 years of dedicated pediatric care.",
    },
  ]);

  // ── Create Appointments ────────────────────────────────────
  const today = new Date();
  const d = (offset) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

  await Appointment.insertMany([
    // Today's appointments
    { patient: patientUsers[0]._id, doctor: doctors[0]._id, date: d(0),  timeSlot: "09:00", symptoms: "Chest pain and shortness of breath", status: "confirmed" },
    { patient: patientUsers[1]._id, doctor: doctors[0]._id, date: d(0),  timeSlot: "10:00", symptoms: "Irregular heartbeat", status: "pending"   },
    { patient: patientUsers[2]._id, doctor: doctors[3]._id, date: d(0),  timeSlot: "09:00", symptoms: "Fever and headache for 3 days", status: "confirmed" },
    { patient: patientUsers[3]._id, doctor: doctors[4]._id, date: d(0),  timeSlot: "11:00", symptoms: "Skin rash on arms", status: "pending" },

    // Upcoming appointments
    { patient: patientUsers[0]._id, doctor: doctors[1]._id, date: d(2),  timeSlot: "10:00", symptoms: "Knee pain while walking", status: "pending" },
    { patient: patientUsers[4]._id, doctor: doctors[2]._id, date: d(3),  timeSlot: "09:00", symptoms: "Frequent headaches and dizziness", status: "confirmed" },
    { patient: patientUsers[1]._id, doctor: doctors[5]._id, date: d(4),  timeSlot: "14:00", symptoms: "Child has high fever", status: "pending" },

    // Past / completed appointments
    {
      patient: patientUsers[2]._id, doctor: doctors[3]._id, date: d(-3), timeSlot: "09:00",
      symptoms: "Cold and cough", status: "completed",
      notes: "Patient is recovering well.",
      prescription: {
        medicines: [
          { name: "Paracetamol 500mg", dosage: "1 tablet", duration: "3 days" },
          { name: "Cetirizine 10mg",   dosage: "1 tablet at night", duration: "5 days" },
        ],
        instructions: "Take rest, drink plenty of fluids. Follow up if fever persists.",
      },
    },
    {
      patient: patientUsers[3]._id, doctor: doctors[0]._id, date: d(-5), timeSlot: "11:00",
      symptoms: "Palpitations", status: "completed",
      notes: "ECG normal. Advised lifestyle changes.",
      prescription: {
        medicines: [{ name: "Metoprolol 25mg", dosage: "1 tablet morning", duration: "30 days" }],
        instructions: "Avoid caffeine and stress. Exercise regularly.",
      },
    },
    {
      patient: patientUsers[0]._id, doctor: doctors[4]._id, date: d(-7), timeSlot: "15:00",
      symptoms: "Acne breakout", status: "completed",
      notes: "Mild acne. Prescribed topical treatment.",
      prescription: {
        medicines: [{ name: "Clindamycin gel", dosage: "Apply twice daily", duration: "2 weeks" }],
        instructions: "Wash face with mild soap. Avoid oily food.",
      },
    },
    { patient: patientUsers[4]._id, doctor: doctors[1]._id, date: d(-2), timeSlot: "10:00", symptoms: "Back pain", status: "cancelled" },
  ]);

  console.log("\n✅ Seed data created successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 LOGIN CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👑 Admin:   admin@hospital.com   / admin123");
  console.log("👨‍⚕️ Doctor:  priya@hospital.com   / doctor123");
  console.log("👨‍⚕️ Doctor:  arjun@hospital.com   / doctor123");
  console.log("🧑 Patient: rohan@gmail.com       / patient123");
  console.log("🧑 Patient: anjali@gmail.com      / patient123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => { console.error("Seed error:", err); process.exit(1); });
