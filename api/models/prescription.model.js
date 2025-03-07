import mongoose, { Schema } from "mongoose";

// Define prescription schema
const prescriptionSchema = new mongoose.Schema(
  {
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    prescription_date: {
      type: Date,
      required: true,
    },
    prescription_details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
