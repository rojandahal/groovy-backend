// sendResponse helper function
const { sendResponse } = require("../helpers/response");
const crypto = require("crypto");
const sharp = require("sharp");

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
//@access   Private: Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  //Code to create product
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
    sku,
  } = req.body;

  if (!category) {
    return next(ApiError.notfound(`Category is required!`));
  }


  req.files.map(file => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/webp"
    ) {
      return next(
        ApiError.notfound(`Only png, jpeg, jpg, webp images are allowed.`)
      );
    }
  });

  // Assuming req.files is an array of uploaded files
  const images = await Promise.all(
    req.files.map(async file => {
      // Generate a unique hash for the image content
      const hash = crypto.createHash("md5").update(file.buffer).digest("hex");

      // Compress file.buffer using sharp
      const compressedImageBuffer = await new Promise((myResolve, myReject) => {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/jpg"
        ) {
          sharp(file.buffer)
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer()
            .then(data => myResolve(data))
            .catch(err => myReject(err));
        } else if (file.mimetype === "image/webp") {
          sharp(file.buffer)
            .toBuffer()
            .then(data => myResolve(data))
            .catch(err => myReject(err));
        }
      });

      // Create an object with data, content type, and unique identifier
      return {
        id: hash,
        contentType: compressedImageBuffer.mimetype,
        fileName: file.originalname,
        fileSize: Buffer.byteLength(compressedImageBuffer),
        data: compressedImageBuffer,
      };
    })
  );

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
      message: "Product Added Successfully.",
    },
    200,
    "application/json"
  );
});

//@des      Update Product
//@route    PUT /api/v1/product/:id
//@access   Private: Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  //Code to update product
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
    sku,
    deleted_images,
  } = req.body;

  const id = req.params.id;
  console.log(
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
    deleted_images
  );
  if (!id) {
    return next(ApiError.notfound(`Product id is required!`));
  }

  if (!category) {
    return next(ApiError.notfound(`Category is required!`));
  }

  if (deleted_images && deleted_images.length > 0) {
    deleted_images.map(async id => {
      await Product.updateOne({ _id: id }, { $pull: { images: { id: id } } });
    });
  }

  // Assuming req.files is an array of uploaded files
  if (req.files && req.files.length > 0) {
    req.files.map(file => {
      if (
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg" &&
        file.mimetype !== "image/webp"
      ) {
        return next(
          ApiError.notfound(`Only png, jpeg, jpg, webp images are allowed.`)
        );
      }
    });
    const imageData = await Promise.all(
      req.files.map(async file => {
        // Generate a unique hash for the image content
        const hash = crypto.createHash("md5").update(file.buffer).digest("hex");

        // Compress file.buffer using sharp
        const compressedImageBuffer = await new Promise(
          (myResolve, myReject) => {
            if (
              file.mimetype === "image/png" ||
              file.mimetype === "image/jpeg" ||
              file.mimetype === "image/jpg"
            ) {
              sharp(file.buffer)
                .resize(800, 800, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer()
                .then(data => myResolve(data))
                .catch(err => myReject(err));
            } else if (file.mimetype === "image/webp") {
              sharp(file.buffer)
                .toBuffer()
                .then(data => myResolve(data))
                .catch(err => myReject(err));
            }
          }
        );

        // Create an object with data, content type, and unique identifier
        return {
          id: hash,
          contentType: compressedImageBuffer.mimetype,
          fileName: file.originalname,
          fileSize: Buffer.byteLength(compressedImageBuffer),
          data: compressedImageBuffer,
        };
      })
    );

    await Product.updateOne({ _id: id }, { $push: { images: imageData } });
  }

  await Product.findByIdAndUpdate(
    id,
    {
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
    },
    { useFindAndModify: false }
  )
    .then(async response => {
      console.log(response);
      if (!response) {
        return next(ApiError.notfound(`Product not found!`));
      }
      return sendResponse(
        res,
        {
          status: "Sucess",
          data: response,
          message: "Update sucess.",
        },
        200,
        "application/json"
      );
    })
    .catch(err => {
      console.log(err);
      return next(ApiError.notfound(`Product not found!`));
    });
});

//@des      Delete Product
//@route    Delete /api/v1/product/:id
//@access   Private: Admin
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
//@route    Get /api/v1/product/search/?name=
//@access   Public
exports.searchProduct = asyncHandler(async (req, res, next) => {
  const nameSearchField = req.query.name;
  const descSearchField = req.query.desc;

  const product = await Product.find({
    product_name: new RegExp(nameSearchField.trim(), "i"),
    description: new RegExp(descSearchField.trim(), "i"),
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
      count: product.length > 0 ? product.length : 0,
      data: product,
      message: "Search sucess.",
    },
    200,
    "application/json"
  );
});
