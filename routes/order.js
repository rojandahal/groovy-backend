const express = require("express");

// Importing controllers
const {
  getAllOrders,
  createOrder,
  deleteOrder,
} = require("../controllers/order.controller");

//Express Router
const router = express.Router();

// Advance results
const advanceResults = require("../middlewares/advanceResults");
const Order = require("../models/orders.model");
const { protect, authorization } = require("../middlewares/auth");

// Routes
router
  .route("/")
  .get(
    advanceResults(Order, {
      path: "order",
      select:
        "_id first_name last_name email phone country state city zip_code address address_full product_id",
    }),
    getAllOrders
  )
  .post(createOrder);

router.route("/:id").delete(protect, authorization("admin"), deleteOrder);

module.exports = router;
