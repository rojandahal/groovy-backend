const mongoose = require("mongoose");

const slugify = require("slugify");

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  title: {
    type: String,
    required: true,
    //Limit Characters to 30 characters
    maxlength: 30,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create bootcamp slug from the name
bannerSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("banner", bannerSchema);
