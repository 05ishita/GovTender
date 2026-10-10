const express = require("express");

const {
  getAdminStats,
  getUsers,
  updateUserStatus,
  getTenders,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(
  protect,
  authorize("admin")
);

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.patch("/users/:id", updateUserStatus);
router.get("/tenders", getTenders);

module.exports = router;