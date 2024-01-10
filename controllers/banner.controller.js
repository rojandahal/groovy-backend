//sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

// Model Banner
const Banner = require("../models/banner.model");
const ApiError = require("../errors/ApiError");
const sharp = require("sharp");

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
  const { title, price, type } = req.body;
  const file = req.file;

  if (!req.file) {
    return next(new ApiError(400, `Please upload a file`));
  }

  if (!title && !price) {
    return next(new ApiError(400, `Please enter title and price`));
  }

  if (!type) {
    return next(new ApiError(400, `Please enter type`));
  }

  if (
    type !== "BANNER_ONE" &&
    type !== "BANNER_TWO" &&
    type !== "NEW_ARRIVAL"
  ) {
    return next(new ApiError(400, `Please enter valid type`));
  }

  const isExists = await Banner.findOne({
    type: type,
  });

  if (isExists) {
    return next(new ApiError(409, `Banner already exists.`));
  }

  if (req.file) {
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
  }

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
  const imageData = {
    contentType: file.mimetype,
    fileName: file.originalname,
    fileSize: Buffer.byteLength(compressedImageBuffer),
    data: compressedImageBuffer,
  };

  const banner = await Banner.create({
    title,
    price,
    type,
    image: imageData,
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
