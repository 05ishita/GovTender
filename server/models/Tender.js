const mongoose = require("mongoose");

const tenderSchema = new mongoose.Schema(
  {
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Government",
        "Defense",
        "Civil Infrastructure",
        "Municipal",
        "Healthcare",
        "Education",
        "IT & Technology",
        "Other",
      ],
      default: "Government",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    budget: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    experienceRequired: {
      type: Number,
      default: 0,
      min: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    documentUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "closed", "awarded"],
      default: "open",
    },

    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tender", tenderSchema);