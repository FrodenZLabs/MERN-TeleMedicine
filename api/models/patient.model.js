import mongoose, { Schema } from "mongoose";

// Define patient schema
const patientSchema = new mongoose.Schema(
  {
    patient_firstName: {
      type: String, 
      required: true,
    },
    patient_lastName: {
      type: String,
      required: true,
    },
    patient_idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    patient_dob: {
      type: Date,
      required: true,
    },
    patient_gender: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
