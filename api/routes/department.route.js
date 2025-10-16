import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentByID,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllDepartments);
router.get("/get/:id", verifyToken, getDepartmentByID);
router.post("/create", verifyToken, createDepartment);
router.put("/update/:id", verifyToken, updateDepartment);
router.delete("/delete/:id", verifyToken, deleteDepartment);

export default router;
