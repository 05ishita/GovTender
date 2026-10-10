const express = require("express");

const {
  createReview,
  getUserReviews,
  getMyReviews,
  getEligibleReviews,
} = require("../controllers/reviewController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/me",
  protect,
  authorize("contractor", "writer", "admin"),
  getMyReviews
);

router.get(
  "/eligible",
  protect,
  authorize("contractor", "writer"),
  getEligibleReviews
);

router.get(
  "/user/:userId",
  protect,
  authorize("contractor", "writer", "admin"),
  getUserReviews
);

router.post(
  "/",
  protect,
  authorize("contractor", "writer"),
  createReview
);

module.exports = router;