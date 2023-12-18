// sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model Product
const Product = require("../models/product.model");
const ApiError = require("../errors/ApiError");

//@des      Get all product
//@route    GET /api/v1/product
//@access   Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Get single Product
//@route    GET /api/v1/product/:id
//@access   Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(ApiError.notfound(`Product not found!`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: product,
    },
    200,
    "application/json"
  );
});

//@des      Create product
//@route    POST /api/v1/product
//@access   Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  //Code to create product
	const images = req.files.map(file => ({ data: file.buffer, contentType: file.mimetype }));
  const {
    product_name,
    description,
    selling_price,
    crossed_price,
    cost_per_item,
    color,
    size,
    category,
    quantity,
    sku
  } = req.body;

  if (!category) {
    return next(ApiError.notfound(`Category is required!`));
  }

  const product = await Product.create({
    product_name,
    description,
    selling_price,
    crossed_price,
    cost_per_item,
    color,
    size,
    category,
    quantity,
    sku,
    images,
  });

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: product,
      message: "Product created sucess.",
    },
    200,
    "application/json"
  );
});

//@des      Update Product
//@route    PUT /api/v1/product/:id
//@access   Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
  //Code to update product
});

//@des      Delete Product
//@route    Delete /api/v1/product/:id
//@access   Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ApiError(400, `Product of id ${req.params.id} couldn't be found.`)
    );
  }

  await product.remove();

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: [],
      message: "Product deletetion sucess.",
    },
    200,
    "application/json"
  );
});

//@des      Search Product using regex
//@route    Get /api/v1/recipe/search/?name=
//@access   Private: [admin, owner]
exports.searchProduct = asyncHandler(async (req, res, next) => {
  const searchField = req.query.name;

  const product = await Product.find({
    name: { $regex: searchField, $options: "$i" },
  });

  if (!product) {
    return next(
      ApiError.notfound(`Product name of ${req.query.name} couldn't found.`)
    );
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: product,
      message: "Search sucess.",
    },
    200,
    "application/json"
  );
});
