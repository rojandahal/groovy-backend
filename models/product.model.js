const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  product_name: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add description"],
    maxlength: [500, "Description  cannot be more than 500 characters."],
  },
  selling_price: {
    type: Number,
    required: [true, "Please add a selling price"],
  },
  crossed_price: {
    type: Number,
  },
  cost_per_item: {
    type: Number,
  },
  color: {
    type: Array,
    default: [],
  },
  size: {
    type: Array,
    default: [],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "categories",
		required: true,
  },
	quantity: {
		type: Number,
	},
	sku: {
		type: String,
	},
	images: {
		type: Array,
		default: []
	},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create bootcamp slug from the name
productSchema.pre("save", function (next) {
  this.slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = mongoose.model("product", productSchema);
