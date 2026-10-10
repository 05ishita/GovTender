const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createTender,
  getAllTenders,
  getMyTenders,
  getTenderById,
  updateTender,
  deleteTender,
} = require("../controllers/tenderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    cb(
      null,
      `${Date.now()}-${baseName}${extension}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC and DOCX documents are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get(
  "/",
  protect,
  getAllTenders
);

router.get(
  "/my",
  protect,
  authorize("contractor"),
  getMyTenders
);

router.get(
  "/:id",
  protect,
  getTenderById
);

router.post(
  "/",
  protect,
  authorize("contractor"),
  upload.single("document"),
  createTender
);

router.put(
  "/:id",
  protect,
  authorize("contractor"),
  updateTender
);

router.delete(
  "/:id",
  protect,
  authorize("contractor"),
  deleteTender
);

module.exports = router;