const Application = require("../models/Application");
const Tender = require("../models/Tender");
const User = require("../models/User");
const Notification = require("../models/Notification");

const calculateMatchScore = (
  tender,
  writer
) => {
  let score = 0;

  const tenderSkills = (tender.skills || []).map(
    (skill) => skill.toLowerCase()
  );

  const writerSkills = (writer.skills || []).map(
    (skill) => skill.toLowerCase()
  );

  if (tenderSkills.length > 0) {
    const matchingSkills = tenderSkills.filter((skill) =>
      writerSkills.some(
        (writerSkill) =>
          writerSkill.includes(skill) ||
          skill.includes(writerSkill)
      )
    );

    score += Math.min(
      60,
      Math.round(
        (matchingSkills.length /
          tenderSkills.length) *
          60
      )
    );
  }

  if (
    writer.experience >=
    tender.experienceRequired
  ) {
    score += 25;
  } else if (
    writer.experience >=
    Math.max(0, tender.experienceRequired - 1)
  ) {
    score += 15;
  }

  if (writer.availability === "available") {
    score += 15;
  }

  return Math.min(100, score);
};

const createApplication = async (req, res) => {
  try {
    const {
      tenderId,
      coverLetter,
      proposedRate,
    } = req.body;

    if (!tenderId || !coverLetter) {
      return res.status(400).json({
        success: false,
        message:
          "Tender and proposal are required.",
      });
    }

    const tender = await Tender.findById(
      tenderId
    );

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found.",
      });
    }

    if (tender.status !== "open") {
      return res.status(400).json({
        success: false,
        message:
          "This tender is no longer accepting applications.",
      });
    }

    if (
      new Date(tender.deadline) <
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The application deadline has passed.",
      });
    }

    const existingApplication =
      await Application.findOne({
        tender: tenderId,
        writer: req.user._id,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied to this tender.",
      });
    }

    const matchScore =
      calculateMatchScore(
        tender,
        req.user
      );

    const application =
      await Application.create({
        tender: tenderId,
        writer: req.user._id,
        coverLetter,
        proposedRate:
          Number(proposedRate) || 0,
        matchScore,
      });

    await Tender.findByIdAndUpdate(
      tenderId,
      {
        $inc: {
          applicationCount: 1,
        },
      }
    );

    await Notification.create({
      user: tender.contractor,
      type: "application",
      title: "New application received",
      message: `${req.user.name} applied to your tender: ${tender.title}.`,
      link: `/applications`,
    });

    const populatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "writer",
          "name email skills experience industries availability expectedRate bio companyName"
        )
        .populate(
          "tender",
          "title category deadline contractor"
        );

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully.",
      application: populatedApplication,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while submitting application.",
    });
  }
};

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        writer: req.user._id,
      })
        .populate(
          "tender",
          "title category deadline status location budget"
        )
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get my applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load your applications.",
    });
  }
};

const getTenderApplications = async (
  req,
  res
) => {
  try {
    const tender =
      await Tender.findById(
        req.params.tenderId
      );

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
          "You can only view applications for your own tenders.",
      });
    }

    const applications =
      await Application.find({
        tender: tender._id,
      })
        .populate(
          "writer",
          "name email skills experience industries availability expectedRate bio companyName isVerified"
        )
        .sort({
          matchScore: -1,
          createdAt: -1,
        });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get tender applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load tender applications.",
    });
  }
};

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "shortlisted",
      "rejected",
      "selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      ).populate("tender");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      application.tender.contractor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this application.",
      });
    }

    if (status === "selected") {
      await Application.updateMany(
        {
          tender: application.tender._id,
          _id: {
            $ne: application._id,
          },
        },
        {
          $set: {
            status: "rejected",
          },
        }
      );

      application.tender.status =
        "awarded";

      await application.tender.save();
    }

    application.status = status;

    await application.save();

    const statusMessages = {
      shortlisted: "Your application has been shortlisted.",
      rejected: "Your application was not selected for this tender.",
      selected: "Congratulations! Your application has been selected.",
      pending: "Your application is pending review.",
    };

    await Notification.create({
      user: application.writer,
      type:
        status === "shortlisted"
          ? "shortlist"
          : status === "selected"
          ? "selection"
          : status === "rejected"
          ? "application"
          : "system",
      title:
        status === "selected"
          ? "Application selected"
          : status === "shortlisted"
          ? "Application shortlisted"
          : status === "rejected"
          ? "Application status updated"
          : "Application status updated",
      message: statusMessages[status],
      link: `/applications`,
    });

    const populatedApplication =
      await Application.findById(
        application._id
      ).populate(
        "writer",
        "name email skills experience industries availability expectedRate bio companyName"
      );

    res.json({
      success: true,
      message:
        "Application status updated successfully.",
      application:
        populatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update application status.",
    });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getTenderApplications,
  updateApplicationStatus,
};