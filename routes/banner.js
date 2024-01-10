const express = require("express");

// Controllers
const {
  getBanner,
  createBanner,
  deleteBanner,
} = require("../controllers/banner.controller.js");

// Multer import
const multer = require("multer");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express router
const Banner = require("../models/banner.model");
const router = express.Router();
const advanceResults = require("../middlewares/advanceResults");
const { protect, authorization } = require("../middlewares/auth.js");

router
  .route("/")
  .get(advanceResults(Banner), getBanner)
  .post(protect, authorization("admin"), upload.single("image"), createBanner);

router.route("/:id").delete(protect, authorization("admin"), deleteBanner);

module.exports = router;
