const Tender = require("../models/Tender");
const Application = require("../models/Application");

const createTender = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      budget,
      deadline,
      experienceRequired,
      skills,
    } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and deadline are required.",
      });
    }

    let parsedSkills = [];

    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === "string") {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    const documentUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const tender = await Tender.create({
      contractor: req.user._id,
      title,
      description,
      category: category || "Government",
      location: location || "",
      budget: Number(budget) || 0,
      deadline,
      experienceRequired:
        Number(experienceRequired) || 0,
      skills: parsedSkills,
      documentUrl,
    });

    const populatedTender = await Tender.findById(
      tender._id
    ).populate("contractor", "name companyName email");

    res.status(201).json({
      success: true,
      message: "Tender created successfully.",
      tender: populatedTender,
    });
  } catch (error) {
    console.error("Create tender error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating tender.",
    });
  }
};

const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({
      status: "open",
      deadline: {
        $gte: new Date(),
      },
    })
      .populate("contractor", "name companyName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tenders.length,
      tenders,
    });
  } catch (error) {
    console.error("Get tenders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load tenders.",
    });
  }
};

const getMyTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({
      contractor: req.user._id,
    }).sort({ createdAt: -1 });

    const tenderIds = tenders.map(
      (tender) => tender._id
    );

    const applicationCounts =
      await Application.aggregate([
        {
          $match: {
            tender: {
              $in: tenderIds,
            },
          },
        },
        {
          $group: {
            _id: "$tender",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const countMap = new Map(
      applicationCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    const result = tenders.map((tender) => {
      const tenderObject = tender.toObject();

      tenderObject.applicationCount =
        countMap.get(tender._id.toString()) || 0;

      return tenderObject;
    });

    res.json({
      success: true,
      count: result.length,
      tenders: result,
    });
  } catch (error) {
    console.error("Get my tenders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load your tenders.",
    });
  }
};

const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate(
      "contractor",
      "name companyName email bio"
    );

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found.",
      });
    }

    const applicationCount =
      await Application.countDocuments({
        tender: tender._id,
      });

    const tenderObject = tender.toObject();

    tenderObject.applicationCount = applicationCount;

    res.json({
      success: true,
      tender: tenderObject,
    });
  } catch (error) {
    console.error("Get tender error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load tender details.",
    });
  }
};

const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found.",
      });
    }

    if (
      tender.contractor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update tenders created by you.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "location",
      "budget",
      "deadline",
      "experienceRequired",
      "skills",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tender[field] = req.body[field];
      }
    });

    await tender.save();

    res.json({
      success: true,
      message: "Tender updated successfully.",
      tender,
    });
  } catch (error) {
    console.error("Update tender error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update tender.",
    });
  }
};

const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found.",
      });
    }

    if (
      tender.contractor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete tenders created by you.",
      });
    }

    await Application.deleteMany({
      tender: tender._id,
    });

    await tender.deleteOne();

    res.json({
      success: true,
      message: "Tender deleted successfully.",
    });
  } catch (error) {
    console.error("Delete tender error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete tender.",
    });
  }
};

module.exports = {
  createTender,
  getAllTenders,
  getMyTenders,
  getTenderById,
  updateTender,
  deleteTender,
};