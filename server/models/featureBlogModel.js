const mongoose = require("mongoose");

const featuredBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
    },
    userImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const FeaturedBlog = mongoose.model("FeaturedBlog", featuredBlogSchema);
module.exports = FeaturedBlog;
