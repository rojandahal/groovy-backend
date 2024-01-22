const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const newArrivalsSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "New Arrivals",
  },
  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create bootcamp slug from the name
newArrivalsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("newarrivals", newArrivalsSchema);
