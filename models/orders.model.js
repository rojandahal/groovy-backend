const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  first_name: {
    type: String,
    required: [true, "Please add a first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please add a last name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email."],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email.",
    ],
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  country: {
    type: String,
    required: [true, "Please add a country"],
  },
  state: {
    type: String,
    required: [true, "Please add a state"],
  },
  city: {
    type: String,
    required: [true, "Please add a city"],
  },
  zip_code: {
    type: String,
    required: [true, "Please add a zip code"],
  },
  address: {
    type: String,
    required: [true, "Please add a address"],
  },
  address_full: {
    type: String,
    required: [true, "Please add a address full"],
  },
  product: {
    type: Object,
    default: [
      {
        product_id: String,
        product_name: String,
        product_sku: String,
        quantity: Number,
        size: String,
        price_per_item: Number,
      },
    ],
    required: [true, "Please add a product"],
  },
	order_group: {
		type: String,
		required: [true, "Please add a order group"],
	},
  shipping_cost: {
    type: Number,
    required: [true, "Please add a shipping cost"],
  },
  total_price: {
    type: Number,
    required: [true, "Please add a total price"],
  },
  payment_status: {
    type: String,
    required: [true, "Please add a payment"],
  },
  payment_method: {
    type: String,
    required: [true, "Please add a payment method"],
  },
  shipping_status: {
    type: String,
    default: "open",
    enum: ["open", "shipped", "delivered"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create bootcamp slug from the name
orderSchema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("orders", orderSchema);
