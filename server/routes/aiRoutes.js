const express = require("express");

const {
  analyzeRfp,
} = require("../controllers/aiController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/analyze-rfp",
  protect,
  authorize("contractor", "writer", "admin"),
  analyzeRfp
);

module.exports = router;
