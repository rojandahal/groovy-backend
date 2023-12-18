const express = require("express");

// Controllers
const {
  getCategory,
  createCategory,
  deleteCategory,
} = require("../controllers/category.controller");

// Express router
const Category = require("../models/category.model");
const router = express.Router();
const advanceResults = require("../middlewares/advanceResults");
const { protect, authorization } = require("../middlewares/auth");

router
  .route("/")
  .get(protect, authorization("admin"), advanceResults(Category), getCategory)
  .post(protect, authorization("admin"), createCategory);

router.route("/:id").delete(protect, authorization("admin"), deleteCategory);

module.exports = router;