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

router.get("/get", verifyToken, getAllPrescriptions);
router.get("/get/:id", verifyToken, getPrescriptionByID);
router.get("/patient/:patient_id", verifyToken, getPrescriptionByPatientID);
router.get("/doctor/:doctor_id", verifyToken, getPrescriptionsByDoctorID);
router.get(
  "/appointment/:appointment_id",
  verifyToken,
  getPrescriptionByAppointmentID
);
router.post("/create", verifyToken, createPrescription);
router.put("/update/:id", verifyToken, updatePrescription);
router.delete("/delete/:id", verifyToken, deletePrescription);

export default router;
