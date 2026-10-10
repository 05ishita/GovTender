const express = require("express");

const {
  createApplication,
  getMyApplications,
  getTenderApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("writer"),
  createApplication
);

router.get(
  "/my",
  protect,
  authorize("writer"),
  getMyApplications
);

router.get(
  "/tender/:tenderId",
  protect,
  authorize("contractor"),
  getTenderApplications
);

router.patch(
  "/:id/status",
  protect,
  authorize("contractor"),
  updateApplicationStatus
);

module.exports = router;