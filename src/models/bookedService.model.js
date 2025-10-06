import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 add this
  bookedDate: { type: Date, required: true },
  bookedTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
