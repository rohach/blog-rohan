const {
    createFeaturedBlog,
    getAllFeaturedBlogs,
    getSingleFeaturedBlog,
    deleteFeaturedBlog,
    updateFeaturedBlog,
    getTopThreeFeaturedBlogs,
    getAllFeaturedBlogsExcludingTopThree,
    likeFeaturedBlog,
  } = require("../controllers/featuredBlogController"); 
  
  const router = require("express").Router();
  
  // Create a featured blog
  router.route("/add").post(createFeaturedBlog);
  
  // Get top three featured blogs
  router.route("/blogs/top").get(getTopThreeFeaturedBlogs);
  
  // Get all featured blogs excluding top 3 blogs
  router.route("/topBlogs").get(getAllFeaturedBlogsExcludingTopThree);
  
  // Get all featured blogs
  router.route("/blogs").get(getAllFeaturedBlogs);
  
  // Get a single featured blog
  router.route("/blog/:id").get(getSingleFeaturedBlog);
  
  // Delete a featured blog
  router.route("/blog/:id").delete(deleteFeaturedBlog);
  
  // Update a featured blog
  router.route("/blog/:id").put(updateFeaturedBlog);
  
  // Like a featured blog
  router.route("/:id/like").post(likeFeaturedBlog);
  
  module.exports = router;
  