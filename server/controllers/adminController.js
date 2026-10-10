const User = require("../models/User");
const Tender = require("../models/Tender");
const Application = require("../models/Application");

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      contractors,
      writers,
      admins,
      totalTenders,
      openTenders,
      totalApplications,
      selectedApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "contractor" }),
      User.countDocuments({ role: "writer" }),
      User.countDocuments({ role: "admin" }),
      Tender.countDocuments(),
      Tender.countDocuments({ status: "open" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "selected" }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        contractors,
        writers,
        admins,
        totalTenders,
        openTenders,
        totalApplications,
        selectedApplications,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load admin statistics.",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isVerified: Boolean(isVerified),
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Admin user update error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update user.",
    });
  }
};

const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find()
      .populate("contractor", "name email companyName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tenders,
    });
  } catch (error) {
    console.error("Admin tenders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load tenders.",
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserStatus,
  getTenders,
};