const Review = require("../models/Review");
const User = require("../models/User");
const Tender = require("../models/Tender");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const createReview = async (req, res) => {
  try {
    const {
      revieweeId,
      tenderId,
      rating,
      comment,
    } = req.body;

    if (
      !revieweeId ||
      !tenderId ||
      rating === undefined ||
      rating === null ||
      !comment?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reviewee, tender, rating and comment are required.",
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number from 1 to 5.",
      });
    }

    if (String(revieweeId) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own account.",
      });
    }

    const reviewee = await User.findById(revieweeId);
    const tender = await Tender.findById(tenderId);

    if (!reviewee || !tender) {
      return res.status(404).json({
        success: false,
        message: "User or tender not found.",
      });
    }

    const selectedApplication = await Application.findOne({
      tender: tenderId,
      writer: { $in: [req.user._id, revieweeId] },
      status: "selected",
    });

    const contractorWriterRelationship =
      String(tender.contractor) === String(req.user._id) &&
      String(revieweeId) === String(selectedApplication?.writer);

    const writerContractorRelationship =
      String(tender.contractor) === String(revieweeId) &&
      String(selectedApplication?.writer) === String(req.user._id);

    if (
      !selectedApplication ||
      (!contractorWriterRelationship &&
        !writerContractorRelationship)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Reviews are available only between users involved in a selected application.",
      });
    }

    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewee: revieweeId,
      tender: tenderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this user for this tender.",
      });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      tender: tenderId,
      rating: numericRating,
      comment: comment.trim(),
    });

    await Notification.create({
      user: revieweeId,
      type: "review",
      title: "New review received",
      message: `${req.user.name} left you a ${numericRating}-star review.`,
      link: `/reviews`,
    });

    const populatedReview = await Review.findById(
      review._id
    )
      .populate("reviewer", "name role")
      .populate("reviewee", "name role")
      .populate("tender", "title");

    res.status(201).json({
      success: true,
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create review.",
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.userId,
    })
      .populate("reviewer", "name role")
      .populate("tender", "title")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Number(average.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.user._id,
    })
      .populate("reviewer", "name role")
      .populate("tender", "title")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Number(average.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};


const getEligibleReviews = async (req, res) => {
  try {
    const applications = await Application.find({
      status: "selected",
    })
      .populate({
        path: "tender",
        select: "title contractor",
        populate: {
          path: "contractor",
          select: "name role companyName",
        },
      })
      .populate("writer", "name role companyName");

    const eligible = [];

    for (const application of applications) {
      const contractor = application.tender?.contractor;
      const writer = application.writer;

      const isContractor =
        contractor && String(contractor._id) === String(req.user._id);
      const isWriter =
        writer && String(writer._id) === String(req.user._id);

      if (!isContractor && !isWriter) continue;

      const reviewee = isContractor ? writer : contractor;

      const existingReview = await Review.findOne({
        reviewer: req.user._id,
        reviewee: reviewee._id,
        tender: application.tender._id,
      }).select("_id rating comment");

      eligible.push({
        tender: {
          _id: application.tender._id,
          title: application.tender.title,
        },
        reviewee: {
          _id: reviewee._id,
          name: reviewee.name,
          role: reviewee.role,
          companyName: reviewee.companyName || "",
        },
        alreadyReviewed: Boolean(existingReview),
        existingReview: existingReview || null,
      });
    }

    res.json({
      success: true,
      collaborations: eligible,
    });
  } catch (error) {
    console.error("Get eligible reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load review opportunities.",
    });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getMyReviews,
  getEligibleReviews,
};