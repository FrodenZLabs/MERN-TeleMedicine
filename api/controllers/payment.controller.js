import moment from "moment";
import Appointment from "../models/appointment.model.js";
import Payment from "../models/payment.model.js";
import { errorHandler } from "../utils/error.js";
import stripe from "../utils/stripe.js";
import { createNotification } from "./notification.controller.js";

// Get all payments
export const getAllPayments = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page } = request.query;
  const skip = (page - 1) * limit;

  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_type appointment_status",
      })
      .lean();

    if (!payments.length) {
      return next(errorHandler(404, "Payment not found"));
    }
    const totalPayments = await Payment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPayments = await Payment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response
      .status(200)
      .json({ payments, totalPayments, lastMonthPayments, page, limit });
  } catch (error) {
    next(errorHandler(500, "Error retrieving payments from the database"));
  }
};

// Get an payments by Patient ID
export const getPaymentByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page } = request.query || 0;
  const skip = (page - 1) * limit;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const payments = await Payment.find({
      patient_id: patientId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_type appointment_status",
      })
      .lean();

    if (!payments.length) {
      return next(errorHandler(404, "Patient Payment not found"));
    }
    const totalPayments = await Payment.find({
      patient_id: patientId,
    }).countDocuments();
    response.status(200).json({ payments, totalPayments, page, limit });
  } catch (error) {
    console.log(error);
    next(
      errorHandler(500, "Error retrieving patient payments from the database")
    );
  }
};

export const createPayment = async (request, response, next) => {
  const { patient_id, appointment_id, payment_amount } = request.body;
  // Accessing current patient user ID
  const currentUserId = request.user._id;

  try {
    if (!patient_id || !appointment_id || !payment_amount) {
      throw new Error("All fields are required.");
    }
    if (isNaN(payment_amount) || payment_amount <= 0) {
      throw new Error("Payment amount must be a positive number.");
    }

    // Convert payment amount to cents
    const amountInCents = Math.round(payment_amount * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "kes",
      payment_method_types: ["card"],
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to create payment intent");
    }

    // Create a new payment record in the database
    const newPayment = new Payment({
      patient_id,
      appointment_id,
      payment_date: new Date(),
      payment_amount: payment_amount,
      payment_status: "Paid",
    });

    // Save the new payment to the database
    await newPayment.save();
    // Create notification for payment
    const paymentDate = moment(newPayment.payment_date).format("LL");
    const paymentTime = moment(newPayment.payment_date).format("h:mm A");
    await createNotification(
      currentUserId,
      "Payment Successful",
      `Your payment of ${payment_amount} KES was successful on ${paymentDate} at ${paymentTime}.`
    );

    // Return the client secret for Stripe to the client
    response.status(201).json({
      success: true,
      id: newPayment._id,
      clientSecret: paymentIntent.client_secret,
      message: "Payment initiated, complete the payment on the client side",
    });
  } catch (error) {
    console.log(error);
    await Appointment.findByIdAndDelete(appointment_id);
    next(errorHandler(500, "Error creating payment."));
  }
};
