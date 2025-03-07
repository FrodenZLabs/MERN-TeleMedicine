import mongoose, { Schema } from "mongoose";

// Define Video consultation schema
const videoConsultationSchema = new mongoose.Schema(
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
    video_consultation_link: {
      type: String,
      required: true,
    },
    consultation_status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VideoConsultation = mongoose.model(
  "VideoConsultation",
  videoConsultationSchema
);

export default VideoConsultation;
