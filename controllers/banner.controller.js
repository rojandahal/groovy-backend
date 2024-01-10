//sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model Banner
const Banner = require("../models/banner.model");
const ApiError = require("../errors/ApiError");

//@des      Get all banner
//@route    GET /api/v1/banner
//@access   Public
exports.getBanner = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Create banner
//@route    POST /api/v1/banner
//@access   Private: admin
exports.createBanner = asyncHandler(async (req, res, next) => {
  const { title, price } = req.body;

  if (!req.file) {
    return next(new ApiError(404, `Please upload a file`));
  }

  if (!title && !price) {
    return next(new ApiError(404, `Please enter title and price`));
  }

  const banner = await Banner.create({
    title,
    price,
    image: req.file.buffer,
  });

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: banner,
      message: "Banner Add Successful",
    },
    200,
    "application/json"
  );
});

//@des      Delete banner
//@route    Delete /api/v1/banner/:id
//@access   Private: admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    return next(new ApiError(404, `Banner not found.`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      message: "Banner Deleted Successfully",
    },
    200,
    "application/json"
  );
});
