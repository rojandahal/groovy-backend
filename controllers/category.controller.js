// sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model recipe
const Category = require("../models/category.model");
const ApiError = require("../errors/ApiError");

//@des      Get all category
//@route    GET /api/v1/category
//@access   Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Create category
//@route    POST /api/v1/category
//@access   Public

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
  return sendResponse(
    res,
    {
      status: "Sucess",
      data: [],
      message: "Deletetion sucess.",
    },
    200,
    "application/json"
  );
});
