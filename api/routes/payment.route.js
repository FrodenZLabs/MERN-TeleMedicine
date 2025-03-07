import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPayment,
  getAllPayments,
  getPaymentByPatientID,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/getAllPayments", verifyToken, getAllPayments);
router.get(
  "/getPaymentByPatientID/patient/:patient_id",
  verifyToken,
  getPaymentByPatientID
);
router.post("/create-payment-intent", verifyToken, createPayment);

export default router;
