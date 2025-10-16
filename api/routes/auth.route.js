import express from "express";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getAdminUsers,
  getAllUsers,
  getUserById,
  login,
  signout,
  signup,
  updateUserById,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from "../utils/multer.js";
import { uploadSingle } from "../utils/uploadImage.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAdmins", verifyToken, getAdminUsers);
router.get("/get", verifyToken, getAllUsers);
router.get("/get/:id", verifyToken, getUserById);
router.put(
  "/update/:id",
  verifyToken,
  upload.single("profileImage"),
  uploadSingle,
  updateUserById
);
router.put("/deactivate/:id", verifyToken, deactivateUser);
router.put("/activate/:id", verifyToken, activateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
