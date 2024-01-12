//sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model newArrivals
const NewArrivals = require("../models/newarrivals.model");
const ApiError = require("../errors/ApiError");
const Product = require("../models/product.model");

//@des      Get all newArrivals
//@route    GET /api/v1/newarrivals
//@access   Public
exports.getNewArrivals = asyncHandler(async (req, res, next) => {
  const newArrivalsId = await NewArrivals.find();

  let newArrivals = [];

  const promises = newArrivalsId.map(async item => {
    const data = await Product.findById(item.product_id);
    newArrivals.push(data);
  });

  await Promise.all(promises);

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: newArrivalsId,
      arrivals: newArrivals,
    },
    200,
    "application/json"
  );
});

//@des      Create newArrivals
//@route    POST /api/v1/newarrivals
//@access   Private: admin
exports.createNewArrivals = asyncHandler(async (req, res, next) => {
  const { id, title } = req.body;

  if (id === "") {
    return next(new ApiError(404, `product_id is required.`));
  }

  const isExists = await NewArrivals.findOne({
    product_id: id,
  });

  if (isExists) {
    return next(new ApiError(404, `NewArrivals already exists.`));
  }

  const newArrivals = await NewArrivals.create({ title, product_id: id });

  const msg = title + " added to New Arrivals successfully.";

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: newArrivals,
      message: msg,
    },
    200,
    "application/json"
  );
});

//@des      Delete newArrivals
//@route    Delete /api/v1/newarrivals/:id
//@access   Private: admin
exports.deleteNewArrivals = asyncHandler(async (req, res, next) => {
  const newArrivals = await NewArrivals.findByIdAndDelete(req.params.id);

  if (!newArrivals) {
    return next(new ApiError(404, `NewArrivals not found.`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      message: "Deletion Successful.",
    },
    200,
    "application/json"
  );
});
