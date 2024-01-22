const express = require("express");

// Controllers
const {
  getNewArrivals,
  createNewArrivals,
  deleteNewArrivals,
} = require("../controllers/newarrivals.controller.js");

// Express router
const NewArrivals = require("../models/newarrivals.model");
const router = express.Router();
const advanceResults = require("../middlewares/advanceResults");
const { protect, authorization } = require("../middlewares/auth.js");

router
  .route("/")
  .get(advanceResults(NewArrivals), getNewArrivals)
  .post(protect, authorization("admin"), createNewArrivals);

router.route("/:id").delete(protect, authorization("admin"), deleteNewArrivals);

module.exports = router;
