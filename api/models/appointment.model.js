import mongoose, { Schema } from "mongoose";

// Define appointment schema
const appointmentSchema = new mongoose.Schema(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    department_id: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    appointment_time: {
      type: String,
      required: true,
    },
    appointment_type: {
      type: String,
      required: true,
    },
    appointment_status: {
      type: String,
      default: "Pending with admin",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
