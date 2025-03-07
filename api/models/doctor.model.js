import mongoose, { Schema } from "mongoose";

// Define Doctor schema
const doctorSchema = new mongoose.Schema(
  {
    doctor_firstName: {
      type: String,
      required: true,
    },
    doctor_lastName: {
      type: String,
      required: true,
    },
    doctor_idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    doctor_number: {
      type: String,
      required: true,
      unique: true,
    },
    department_id: {
      type: Schema.Types.ObjectId,
      ref: "Department",
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
