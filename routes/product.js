const express = require("express");

// Controllers
const {
  getAllProducts,
  createProduct,
  searchProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

// Multer import
const multer = require("multer");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express router
const router = express.Router();

// Advance results
const advanceResults = require("../middlewares/advanceResults");
const Product = require("../models/product.model");
const { protect, authorization } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advanceResults(Product, {
      path: "product",
      select:
        "_id product _name description selling_price crossed_price cost_per_item color size category quantity sku images",
    }),
    getAllProducts
  )
  .post(
    protect,
    authorization("admin"),
    upload.array("images", 4),
    createProduct
  );

router.route("/search").get(
  advanceResults(Product, {
    path: "product",
    select: "product_name description crossed_price",
  }),
  searchProduct
);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, authorization("admin"), deleteProduct)
  .put(
    protect,
    authorization("admin"),
    upload.array("images", 4),
    updateProduct
  );

module.exports = router;
