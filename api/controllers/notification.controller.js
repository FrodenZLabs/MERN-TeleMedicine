import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/error.js";

// Function to create a new notification
export const createNotification = async (userId, title, message) => {
  try {
    const notification = new Notification({
      user_id: userId,
      title,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Function to get notification by ID
export const getNotificationById = async (request, response, next) => {
  const notificationId = request.params.id;
  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      next(errorHandler(404, "Notification not found"));
      return;
    }

    response.status(200).json(notification);
  } catch (error) {
    next(
      errorHandler(500, "An error occurred during fetching the notification.")
    );
  }
};

// Function to get notifications by user ID
export const getNotificationsByUserId = async (request, response, next) => {
  const userId = request.params.user_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      user_id: userId,
      viewed: false,
    });
    // Count total notifications
    const totalNotifications = await Notification.countDocuments({
      user_id: userId,
    })

    response.status(200).json({
      notifications,
      totalNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    next(errorHandler(500, "An error occurred during fetching notifications."));
  }
};

// Function to update notification viewed status
export const markNotificationAsViewed = async (request, response, next) => {
  const notificationId = request.params.id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      next(errorHandler(404, "Notification not found"));
    }

    notification.viewed = true;
    await notification.save();

    response.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as viewed:", error);
    next(
      errorHandler(
        500,
        "An error occurred during marking notification as viewed."
      )
    );
  }
};

// Function to mark all notifications as viewed
export const markAllNotificationsAsViewed = async (request, response, next) => {
  const userId = request.params.user_id;

  try {
    const notifications = await Notification.updateMany(
      { user_id: userId, viewed: false },
      { $set: { viewed: true } }
    );

    if (notifications.matchedCount === 0) {
      return next(errorHandler(404, "No new notifications found to update"));
    }

    response
      .status(200)
      .json({ message: "All notifications marked as viewed", notifications });
  } catch (error) {
    next(
      errorHandler(
        500,
        "An error occurred while marking all notifications as viewed."
      )
    );
  }
};

// Function to delete a notification by ID
export const deleteNotificationById = async (request, response, next) => {
  const notificationId = request.params.id;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(errorHandler(404, "Notification not found"));
    }

    await Notification.findByIdAndDelete(notificationId);
    response.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(
      errorHandler(500, "An error occurred during deletion of notification")
    );
  }
};

// Function to delete all notifications by user ID
export const deleteNotificationsByUserId = async (request, response, next) => {
  const userId = request.params.user_id;

  try {
    // Delete notifications matching the user ID
    const deleteResult = await Notification.deleteMany({ user_id: userId });

    if (deleteResult.deletedCount === 0) {
      return response
        .status(404)
        .json({ message: "No notifications found to delete." });
    }

    response
      .status(200)
      .json({ message: `Deleted ${deleteResult.deletedCount} notifications.` });
  } catch (error) {
    next(
      errorHandler(500, "An error occurred during deletion of notifications.")
    );
  }
};
