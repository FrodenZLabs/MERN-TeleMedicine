import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPayment,
  getAllPayments,
  getPaymentByPatientID,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllPayments);
router.get("/patient/:patient_id", verifyToken, getPaymentByPatientID);
router.post("/create", verifyToken, createPayment);

export default router;
