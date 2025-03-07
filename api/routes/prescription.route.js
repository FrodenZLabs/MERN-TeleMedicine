import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPrescription,
  deletePrescription,
  getAllPrescriptions,
  getPrescriptionByAppointmentID,
  getPrescriptionByID,
  getPrescriptionByPatientID,
  getPrescriptionsByDoctorID,
  updatePrescription,
} from "../controllers/prescription.controller.js";

const router = express.Router();

router.get("/getAllPrescriptions", verifyToken, getAllPrescriptions);
router.get("/getPrescriptions/:id", verifyToken, getPrescriptionByID);
router.get(
  "/getPrescriptions/patient/:patient_id",
  verifyToken,
  getPrescriptionByPatientID
);
router.get(
  "/getPrescriptions/doctor/:doctor_id",
  verifyToken,
  getPrescriptionsByDoctorID
);
router.get(
  "/getPrescriptions/appointment/:appointment_id",
  verifyToken,
  getPrescriptionByAppointmentID
);
router.post("/createPrescription", verifyToken, createPrescription);
router.put("/updatePrescription/:id", verifyToken, updatePrescription);
router.delete("/deletePrescription/:id", verifyToken, deletePrescription);

export default router;
