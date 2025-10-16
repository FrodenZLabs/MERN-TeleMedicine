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

router.get("/get", verifyToken, getAllVideoConsultations);
router.get("/get/:id", verifyToken, getVideoConsultationById);
router.get("/doctor/:doctor_id", verifyToken, getVideoConsultationsByDoctorId);
router.get(
  "/patient/:patient_id",
  verifyToken,
  getVideoConsultationsByPatientId
);
router.post("/create", verifyToken, createVideoConsultation);
router.put("/update/:id", verifyToken, updateVideoConsultation);

export default router;
