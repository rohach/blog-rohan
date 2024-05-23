const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getTopThreeBlogs,
  getAllBlogsExcludingTopThree,
  likeBlog,
} = require("../controllers/blogController");

const router = require("express").Router();

// Create a blog
router.route("/add").post(createBlog);

// Get all blogs
router.route("/blogs/top").get(getTopThreeBlogs);

// Get all blogs excluding top 3 blogs
router.route("/topBlogs").get(getAllBlogsExcludingTopThree);

// Get all blogs
router.route("/blogs").get(getAllBlogs);

// Get a blog
router.route("/blog/:id").get(getSingleBlog);

// Delete a blog
router.route("/blog/:id").delete(deleteBlog);

// Update a blog
router.route("/blog/:id").put(updateBlog);

// Like a blog
router.route("/:id/like").post(likeBlog);

module.exports = router;
