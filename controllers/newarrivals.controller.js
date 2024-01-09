//sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model newArrivals
const NewArrivals = require("../models/newarrivals.model");
const ApiError = require("../errors/ApiError");

//@des      Get all newArrivals
//@route    GET /api/v1/newarrivals
//@access   Public
exports.getNewArrivals = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Create newArrivals
//@route    POST /api/v1/newarrivals
//@access   Private: admin
exports.createNewArrivals = asyncHandler(async (req, res, next) => {
  const { product_id } = req.body;

  if (product_id === "") {
    return next(new ApiError(404, `product_id is required.`));
  }

  // const isExists = await NewArrivals.findOne({
  //   product_id: new RegExp(product_id.trim(), "i"),
  // });

  // console.log(isExists)

  // if (isExists) {
  //   return next(new ApiError(404, `NewArrivals already exists.`));
  // }

  const newArrivals = await NewArrivals.create({ product_id });

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: newArrivals,
      message: "New Arrival creation successful.",
    },
    200,
    "application/json"
  );
});

//@des      Delete newArrivals
//@route    Delete /api/v1/newarrivals/:id
//@access   Private: admin
exports.deleteNewArrivals = asyncHandler(async (req, res, next) => {
  const { product_id } = req.body;

  const newArrivals = await NewArrivals.findByIdAndDelete(req.params.id);

  if (!newArrivals) {
    return next(new ApiError(404, `NewArrivals not found.`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      message: "NewArrivals deletion successful.",
    },
    200,
    "application/json"
  );
});
