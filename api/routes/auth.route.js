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

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAdmins", verifyToken, getAdminUsers);
router.get("/getUsers", verifyToken, getAllUsers);
router.get("/getUsers/:id", verifyToken, getUserById);
router.put("/update/:id", verifyToken, updateUserById);
router.put("/deactivate/:id", verifyToken, deactivateUser);
router.put("/activate/:id", verifyToken, activateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
