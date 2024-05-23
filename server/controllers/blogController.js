const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const upload = require("../utils/upload");
const User = require("../models/userModel");

// Create Blog
exports.createBlog = [
  upload.single("image"),
  async (req, res) => {
    try {
      const blogData = req.body;
      let user = await User.findOne({ email: blogData.userEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (req.file) {
        blogData.image = req.file.path;
      }

      blogData.user = user._id;
      blogData.userName = user.name;
      blogData.likes = 0; // Initialize likes to 0 when creating a new blog
      const blog = await Blog.create(blogData);

      res.status(201).json({
        success: true,
        message: "Blog created!",
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add Blog!",
      });
    }
  },
];

// Like Blog
exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    const userId = req.user.id;
    const isLiked = blog.likes.some((userId) => userId === req.user.id);

    if (isLiked) {
      blog.likes = blog.likes.filter((userId) => userId !== req.user.id);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: isLiked
        ? "Blog disliked successfully!"
        : "Blog liked successfully!",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to like/dislike the blog!",
    });
  }
};

// Get three blogs
exports.getTopThreeBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3);
    const length = blogs.length;

    res.status(200).json({
      success: true,
      blogs: blogs,
      length: length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving top blogs",
    });
  }
};

// Get all blogs excluding the 3 blogs
exports.getAllBlogsExcludingTopThree = async (req, res) => {
  try {
    const topThreeBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3);

    const allBlogsExceptTopThree = await Blog.find({
      _id: { $nin: topThreeBlogs.map((blog) => blog._id) },
    }).sort({ createdAt: -1 });

    const length = allBlogsExceptTopThree.length;

    res.status(200).json({
      success: true,
      blogs: allBlogsExceptTopThree,
      length: length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving blogs",
    });
  }
};

// Get All blogs
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    if (blogs) {
      res.status(200).json({
        success: true,
        blogs,
      });
    } else {
      return next(new ErrorHandler("Failed to Get all Blogs", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 400));
  }
};

// Get single blog
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get Blog!",
    });
  }
};

// Update blog
exports.updateBlog = [
  upload.single("image"),
  async (req, res) => {
    try {
      let blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found!",
        });
      }

      const blogUpdated = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      if (req.file) {
        blogUpdated.image = req.file.path;
      }

      res.status(200).json({
        success: true,
        message: "Your Blog updated successfully!",
        blogUpdated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to update your Blog!",
      });
    }
  },
];

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    await blog.remove();

    res.status(200).json({
      success: true,
      message: "Blog deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete the Blog!",
    });
  }
};
