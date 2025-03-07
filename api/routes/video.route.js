import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createVideoConsultation,
  getAllVideoConsultations,
  getVideoConsultationById,
  getVideoConsultationsByDoctorId,
  getVideoConsultationsByPatientId,
  updateVideoConsultation,
} from "../controllers/video.controller.js";

const router = express.Router();

router.get("/getVideoConsultations", verifyToken, getAllVideoConsultations);
router.get("/getVideoConsultations/:id", verifyToken, getVideoConsultationById);
router.get(
  "/getVideoConsultations/doctor/:doctor_id",
  verifyToken,
  getVideoConsultationsByDoctorId
);
router.get(
  "/getVideoConsultations/patient/:patient_id",
  verifyToken,
  getVideoConsultationsByPatientId
);
router.post("/createVideoConsultation", verifyToken, createVideoConsultation);
router.put(
  "/getVideoConsultations/update/:id",
  verifyToken,
  updateVideoConsultation
);

export default router;
