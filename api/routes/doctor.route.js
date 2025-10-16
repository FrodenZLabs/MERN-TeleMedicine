import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorDetails,
  getDoctorsByDepartment,
  updateDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllDoctors);
router.get("/get/:id", verifyToken, getDoctorById);
router.post("/create", verifyToken, createDoctor);
router.put("/update/:id", verifyToken, updateDoctor);
router.delete("/delete/:id", verifyToken, deleteDoctor);
router.get(
  "/get/department/:department_id",
  verifyToken,
  getDoctorsByDepartment
);
router.get("/getDoctors/appointmentDetails/:id", verifyToken, getDoctorDetails);

export default router;
