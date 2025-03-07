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

router.get("/getPatients", verifyToken, getAllPatients);
router.get("/getPatients/:id", verifyToken, getPatientById);
router.post("/createPatient", verifyToken, createPatient);
router.put("/getPatients/:id", verifyToken, updatePatient);
router.delete("/getPatients/:id", verifyToken, deletePatient);
router.get(
  "/getPatients/appointmentDetails/:id",
  verifyToken,
  getPatientDetails
);

export default router;
