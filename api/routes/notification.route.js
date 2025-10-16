import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteNotificationById,
  deleteNotificationsByUserId,
  getNotificationById,
  getNotificationsByUserId,
  markAllNotificationsAsViewed,
  markNotificationAsViewed,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/get/:id", verifyToken, getNotificationById);
router.get("/user/:user_id", verifyToken, getNotificationsByUserId);
router.put("/mark/:id", verifyToken, markNotificationAsViewed);
router.put("/markAll/:user_id", verifyToken, markAllNotificationsAsViewed);
router.delete("/delete/:id", verifyToken, deleteNotificationById);
router.delete("/deleteAll/:user_id", verifyToken, deleteNotificationsByUserId);

export default router;
