import mongoose, { Schema } from "mongoose";

// Define payment schema
const paymentShema = new mongoose.Schema(
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
    payment_date: {
      type: Date,
      required: true,
    },
    payment_amount: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentShema);

export default Payment;
