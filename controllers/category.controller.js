// sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model category
const Category = require("../models/category.model");
const ApiError = require("../errors/ApiError");
const productModel = require("../models/product.model");

//@des      Get all category
//@route    GET /api/v1/category
//@access   Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Create category
//@route    POST /api/v1/category
//@access   Private: admin

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  if (title === "") {
    return next(new ApiError(404, `Title is required.`));
  }

  const isExists = await Category.findOne({
    title: new RegExp(title.trim(), "i"),
  });
  if (isExists) {
    return next(new ApiError(404, `Category already exists.`));
  }

  const category = await Category.create(req.body);

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: category,
      message: "Category creation successful.",
    },
    200,
    "application/json"
  );
});

//@des      Delete category
//@route    Delete /api/v1/category/:id
//@access   Private: admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new ApiError(404, `Category not found.`));
  }

  // Delete all product related to category
  // Find all products related to category

  const product = await productModel.find({ category: req.params.id });

  if (product) {
    await productModel.deleteMany({ category: req.params.id });
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: product,
      message: "Category deletetion sucess. With all product related to it.",
    },
    200,
    "application/json"
  );
});
