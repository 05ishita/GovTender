const User = require("../models/User");
const Tender = require("../models/Tender");

const getWriters = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      availability = "",
    } = req.query;

    const filter = {
      role: "writer",
    };

    if (availability) {
      filter.availability = availability;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          bio: {
            $regex: search,
            $options: "i",
          },
        },
        {
          skills: {
            $regex: search,
            $options: "i",
          },
        },
        {
          industries: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.industries = {
        $regex: category,
        $options: "i",
      };
    }

    const writers = await User.find(filter)
      .select(
        "-password"
      )
      .sort({
        isVerified: -1,
        experience: -1,
        createdAt: -1,
      });

    res.json({
      success: true,
      count: writers.length,
      writers,
    });
  } catch (error) {
    console.error("Get writers error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load bid writers.",
    });
  }
};

const getWriterById = async (req, res) => {
  try {
    const writer = await User.findOne({
      _id: req.params.id,
      role: "writer",
    }).select("-password");

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: "Bid writer not found.",
      });
    }

    res.json({
      success: true,
      writer,
    });
  } catch (error) {
    console.error("Get writer error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load writer profile.",
    });
  }
};

const getMyWriterProfile = async (req, res) => {
  try {
    const writer = await User.findById(
      req.user._id
    ).select("-password");

    if (!writer || writer.role !== "writer") {
      return res.status(404).json({
        success: false,
        message: "Writer profile not found.",
      });
    }

    res.json({
      success: true,
      writer,
    });
  } catch (error) {
    console.error(
      "Get my writer profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load your profile.",
    });
  }
};

const updateMyWriterProfile = async (
  req,
  res
) => {
  try {
    const writer = await User.findById(
      req.user._id
    );

    if (!writer || writer.role !== "writer") {
      return res.status(404).json({
        success: false,
        message: "Writer profile not found.",
      });
    }

    const {
      name,
      phone,
      companyName,
      bio,
      skills,
      experience,
      industries,
      availability,
      expectedRate,
    } = req.body;

    if (name !== undefined) {
      writer.name = name.trim();
    }

    if (phone !== undefined) {
      writer.phone = phone.trim();
    }

    if (companyName !== undefined) {
      writer.companyName =
        companyName.trim();
    }

    if (bio !== undefined) {
      writer.bio = bio.trim();
    }

    if (experience !== undefined) {
      writer.experience =
        Number(experience) || 0;
    }

    if (expectedRate !== undefined) {
      writer.expectedRate =
        Number(expectedRate) || 0;
    }

    if (availability !== undefined) {
      const allowedAvailability = [
        "available",
        "busy",
        "unavailable",
      ];

      if (
        allowedAvailability.includes(
          availability
        )
      ) {
        writer.availability =
          availability;
      }
    }

    if (Array.isArray(skills)) {
      writer.skills = skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    if (typeof skills === "string") {
      writer.skills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    if (Array.isArray(industries)) {
      writer.industries = industries
        .map((industry) =>
          String(industry).trim()
        )
        .filter(Boolean);
    }

    if (typeof industries === "string") {
      writer.industries = industries
        .split(",")
        .map((industry) =>
          industry.trim()
        )
        .filter(Boolean);
    }

    await writer.save();

    const updatedWriter =
      await User.findById(writer._id).select(
        "-password"
      );

    res.json({
      success: true,
      message:
        "Writer profile updated successfully.",
      writer: updatedWriter,
    });
  } catch (error) {
    console.error(
      "Update writer profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update writer profile.",
    });
  }
};

const getRecommendedWriters = async (
  req,
  res
) => {
  try {
    const tender = await Tender.findById(
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
          "You can only get recommendations for your own tender.",
      });
    }

    const writers = await User.find({
      role: "writer",
    }).select("-password");

    const tenderSkills = (
      tender.skills || []
    ).map((skill) =>
      skill.toLowerCase()
    );

    const recommended = writers
      .map((writer) => {
        const writerSkills = (
          writer.skills || []
        ).map((skill) =>
          skill.toLowerCase()
        );

        const matchingSkills =
          tenderSkills.filter((skill) =>
            writerSkills.some(
              (writerSkill) =>
                writerSkill.includes(skill) ||
                skill.includes(writerSkill)
            )
          );

        let score = 0;

        if (tenderSkills.length > 0) {
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
          Math.max(
            0,
            tender.experienceRequired - 1
          )
        ) {
          score += 15;
        }

        if (
          writer.availability ===
          "available"
        ) {
          score += 15;
        }

        return {
          ...writer.toObject(),
          matchScore: Math.min(
            100,
            score
          ),
        };
      })
      .sort(
        (a, b) =>
          b.matchScore - a.matchScore
      )
      .slice(0, 10);

    res.json({
      success: true,
      count: recommended.length,
      writers: recommended,
    });
  } catch (error) {
    console.error(
      "Recommended writers error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to generate writer recommendations.",
    });
  }
};

module.exports = {
  getWriters,
  getWriterById,
  getMyWriterProfile,
  updateMyWriterProfile,
  getRecommendedWriters,
};