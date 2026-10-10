const express = require("express");

const {
  getConversation,
  sendMessage,
  getMyConversations,
} = require("../controllers/messageController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("contractor", "writer", "admin"),
  getMyConversations
);

router.get(
  "/:userId",
  protect,
  authorize("contractor", "writer", "admin"),
  getConversation
);

router.post(
  "/",
  protect,
  authorize("contractor", "writer", "admin"),
  sendMessage
);

module.exports = router;