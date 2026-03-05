const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    experience: { type: Number, default: 0 },
    fees: { type: Number, default: 500 },
    availableDays: [{ type: String }], // ["Monday","Wednesday","Friday"]
    availableTime: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },
    bio: String,
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
