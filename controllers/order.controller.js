//sendResponse helper function
const { sendResponse } = require("../helpers/response");

// asyncHandler import
const asyncHandler = require("../helpers/asyncHandler");

//Nodemailer import
const sendEmail = require("../service/emailer");

// Model Product
const Order = require("../models/orders.model");
const ApiError = require("../errors/ApiError");
const ejs = require("ejs");
const crypto = require("crypto");

//@des      Get all orders
//@route    GET /api/v1/order
//@access   Public
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  return sendResponse(res, res.advanceResults, 200, "application/json");
});

//@des      Create order
//@route    POST /api/v1/order
//@access   Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  //Code to create order
  const {
    first_name,
    last_name,
    email,
    phone,
    country,
    state,
    city,
    zip_code,
    address,
    address_full,
    product,
    shipping_cost,
    total_price,
    payment_status,
    payment_method,
  } = req.body;

  let allOrders = [];

  const orderGroup = "order_" + crypto.randomBytes(8).toString("hex");

  console.log({
    order_group: orderGroup,
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    country: country,
    state: state,
    city: city,
    zip_code: zip_code,
    address: address,
    address_full: address_full,
    product: product,
    shipping_cost: shipping_cost,
    total_price: total_price,
    payment_status: payment_status,
    payment_method: payment_method,
  });

  product.map(async (item, count) => {
    //Append total amount to the productToAdd
    const newOrder = await Order.create({
      order_group: orderGroup,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      country: country,
      state: state,
      city: city,
      zip_code: zip_code,
      address: address,
      address_full: address_full,
      product: {
        product_id: item?.product_id,
        product_name: item?.product_name,
        product_price: item?.product_price,
        size: item?.size,
        color: item?.color,
        quantity_count: item?.count,
        total_amount: item?.product_price * item?.count,
      },
      shipping_cost: shipping_cost,
      total_price: item?.product_price * item?.count,
      payment_status: payment_status,
      payment_method: payment_method,
    });
    allOrders.push(newOrder);
  });

  const productToEmail = await product.map(item => {
    return {
      product_id: item?.product_id,
      product_name: item?.product_name,
      product_price: item?.product_price,
      size: item?.size,
      color: item?.color,
      quantity_count: item?.count,
    };
  });

  const user = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    country: country,
    state: state,
    city: city,
    zip_code: zip_code,
    address: address,
    address_full: address_full,
    product: productToEmail,
    shipping_cost: shipping_cost,
    total_price: total_price,
    payment_status: payment_status,
    payment_method: payment_method,
  };

  const adminEmail = process.env.ADMIN_EMAIL;

  // Send email to user
  await sendEmail({
    from: `Groovy <${adminEmail}>`,
    to: email,
    subject: "Order confirmation",
    message: "Your order has been confirmed",
    user: user,
  }).then(async res => {
    // Send email to admin;
    sendEmail({
      from: `Groovy <${adminEmail}>`,
      to: adminEmail,
      subject: "New order has been placed",
      user: user,
    });
  });

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: allOrders,
      message: "New Order Placed Successfully",
    },
    200,
    "application/json"
  );
});

//@des      Delete order
//@route    DELETE /api/v1/order/:id
//@access   Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(ApiError.notfound(`Order not found!`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: [],
      message: "Order deleted successfully.",
    },
    200,
    "application/json"
  );
});

//@des      Update order
//@route    PUT /api/v1/order/:id
//@access   Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  //Code to update order
  const { shipping_status } = req.body;

  const id = req.params.id;
  if (!id) {
    return next(ApiError.notfound(`Order id is required!`));
  }

  if (!shipping_status) {
    return next(ApiError.notfound(`Shipping status is required!`));
  }

  const order = await Order.findByIdAndUpdate(
    id,
    {
      shipping_status: shipping_status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return next(ApiError.notfound(`Order not found!`));
  }

  return sendResponse(
    res,
    {
      status: "Sucess",
      data: order,
      message: "Order updated successfully.",
    },
    200,
    "application/json"
  );
});
