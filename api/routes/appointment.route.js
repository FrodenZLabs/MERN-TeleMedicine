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

router.get("/getAppointments", verifyToken, getAllAppointments);
router.get("/getAppointments/:id", verifyToken, getAppointmentByID);
router.get(
  "/getAppointments/doctor/:doctor_id",
  verifyToken,
  getAppointmentByDoctorID
);
router.get(
  "/getAppointments/patient/:patient_id",
  verifyToken,
  getAppointmentByPatientID
);
router.post("/createAppointment", verifyToken, createAppointment);
router.put("/getAppointments/:id", verifyToken, updateAppointment);
router.delete("/getAppointments/:id", verifyToken, deleteAppointment);
router.get("/getAllReports", verifyToken, getAllReports);

export default router;
