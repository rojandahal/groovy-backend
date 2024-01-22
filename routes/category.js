const express = require("express");

// Controllers
const {
  getCategory,
  createCategory,
  deleteCategory,
  getProductOfCategory,
} = require("../controllers/category.controller");

// Express router
const Category = require("../models/category.model");
const router = express.Router();
const advanceResults = require("../middlewares/advanceResults");
const { protect, authorization } = require("../middlewares/auth");

router
  .route("/")
  .get(advanceResults(Category), getCategory)
  .post(protect, authorization("admin"), createCategory);

router.route("/:id").delete(protect, authorization("admin"), deleteCategory);

router
  .route("/products/:id")
  .get(advanceResults(Category), getProductOfCategory);

module.exports = router;
