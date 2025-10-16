import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
  getPatientDetails,
  updatePatient,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllPatients);
router.get("/get/:id", verifyToken, getPatientById);
router.post("/create", verifyToken, createPatient);
router.put("/update/:id", verifyToken, updatePatient);
router.delete("/delete/:id", verifyToken, deletePatient);
router.get("/appointmentDetails/:id", verifyToken, getPatientDetails);

export default router;
