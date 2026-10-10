const express = require("express");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("contractor", "writer", "admin"),
  getNotifications
);

router.patch(
  "/read-all",
  protect,
  authorize("contractor", "writer", "admin"),
  markAllNotificationsRead
);

router.patch(
  "/:id/read",
  protect,
  authorize("contractor", "writer", "admin"),
  markNotificationRead
);

module.exports = router;