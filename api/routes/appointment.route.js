import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAllReports,
  getAppointmentByDoctorID,
  getAppointmentByID,
  getAppointmentByPatientID,
  updateAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllAppointments);
router.get("/get/:id", verifyToken, getAppointmentByID);
router.get("/doctor/:doctor_id", verifyToken, getAppointmentByDoctorID);
router.get("/patient/:patient_id", verifyToken, getAppointmentByPatientID);
router.post("/create", verifyToken, createAppointment);
router.put("/update/:id", verifyToken, updateAppointment);
router.delete("/delete/:id", verifyToken, deleteAppointment);
router.get("/getAllReports", verifyToken, getAllReports);

export default router;
