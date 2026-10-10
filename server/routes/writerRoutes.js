const express = require("express");

const {
  getWriters,
  getWriterById,
  getMyWriterProfile,
  updateMyWriterProfile,
  getRecommendedWriters,
} = require("../controllers/writerController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("contractor", "writer", "admin"),
  getWriters
);

router.get(
  "/me",
  protect,
  authorize("writer"),
  getMyWriterProfile
);

router.put(
  "/me",
  protect,
  authorize("writer"),
  updateMyWriterProfile
);

router.get(
  "/recommended/:tenderId",
  protect,
  authorize("contractor"),
  getRecommendedWriters
);

router.get(
  "/:id",
  protect,
  authorize("contractor", "writer", "admin"),
  getWriterById
);

module.exports = router;