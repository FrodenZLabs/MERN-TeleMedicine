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

router.get("/getNotifications/:id", verifyToken, getNotificationById);
router.get(
  "/getNotifications/user/:user_id",
  verifyToken,
  getNotificationsByUserId
);
router.put("/getNotifications/:id", verifyToken, markNotificationAsViewed);
router.put("/markAllAsViewed/:user_id", verifyToken, markAllNotificationsAsViewed);
router.delete("/deleteNotification/:id", verifyToken, deleteNotificationById);
router.delete(
  "/deleteAllNotifications/:user_id",
  verifyToken,
  deleteNotificationsByUserId
);

export default router;
