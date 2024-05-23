const FeaturedBlog = require("../models/featureBlogModel");
const upload = require("../utils/upload");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// Create Featured Blog
exports.createFeaturedBlog = [
  upload.single("image"),
  async (req, res) => {
    try {
      const featuredBlogData = req.body;
      let user = await User.findOne({ email: featuredBlogData.userEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (req.file) {
        featuredBlogData.image = req.file.path;
      }
      featuredBlogData.user = user._id;
      featuredBlogData.userName = user.name;
      featuredBlogData.userImage = user.image;
      featuredBlogData.likes = 0; // Initialize likes to 0 when creating a new blog
      const featuredBlog = await FeaturedBlog.create(featuredBlogData);

      res.status(201).json({
        success: true,
        message: "Featured Blog created!",
        featuredBlog,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to add Featured Blog!",
      });
    }
  },
];

// Like Featured Blog
exports.likeFeaturedBlog = async (req, res) => {
  try {
    const featuredBlogId = req.params.id;
    const featuredBlog = await FeaturedBlog.findById(featuredBlogId);

    if (!featuredBlog) {
      return res.status(404).json({
        success: false,
        message: "Featured Blog not found!",
      });
    }

    const userId = req.user.id;
    const isLiked = featuredBlog.likes.includes(userId);

    if (isLiked) {
      featuredBlog.likes = featuredBlog.likes.filter((id) => id !== userId);
    } else {
      featuredBlog.likes.push(userId);
    }

    await featuredBlog.save();

    res.status(200).json({
      success: true,
      message: isLiked
        ? "Blog disliked successfully!"
        : "Blog liked successfully!",
      featuredBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to like/dislike the featured blog!",
    });
  }
};

// Get three featured blogs
exports.getTopThreeFeaturedBlogs = async (req, res) => {
  try {
    const featuredBlogs = await FeaturedBlog.find({})
      .sort({ createdAt: -1 })
      .limit(3);
    const length = featuredBlogs.length;

    res.status(200).json({
      success: true,
      featuredBlogs,
      length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving top featured blogs",
    });
  }
};

// Get all featured blogs excluding the top 3
exports.getAllFeaturedBlogsExcludingTopThree = async (req, res) => {
  try {
    const topThreeFeaturedBlogs = await FeaturedBlog.find({})
      .sort({ createdAt: -1 })
      .limit(3);

    const allBlogsExceptTopThree = await FeaturedBlog.find({
      _id: { $nin: topThreeFeaturedBlogs.map((blog) => blog._id) },
    }).sort({ createdAt: -1 });

    const length = allBlogsExceptTopThree.length;

    res.status(200).json({
      success: true,
      blogs: allBlogsExceptTopThree,
      length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving featured blogs",
    });
  }
};

// Get all featured blogs
exports.getAllFeaturedBlogs = async (req, res, next) => {
  try {
    const featuredBlogs = await FeaturedBlog.find();

    if (featuredBlogs) {
      res.status(200).json({
        success: true,
        featuredBlogs,
      });
    } else {
      return next(new ErrorHandler("Failed to get all featured blogs", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 400));
  }
};

// Get single featured blog
exports.getSingleFeaturedBlog = async (req, res) => {
  try {
    const featuredBlog = await FeaturedBlog.findById(req.params.id);

    if (!featuredBlog) {
      return res.status(404).json({
        success: false,
        message: "Featured Blog not found!",
      });
    }
    res.status(200).json({
      success: true,
      featuredBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get Featured Blog!",
    });
  }
};

// Update featured blog
exports.updateFeaturedBlog = [
  upload.single("image"),
  async (req, res) => {
    try {
      let featuredBlog = await FeaturedBlog.findById(req.params.id);

      if (!featuredBlog) {
        return res.status(404).json({
          success: false,
          message: "Featured Blog not found!",
        });
      }

      const featuredBlogUpdated = await FeaturedBlog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      if (req.file) {
        featuredBlogUpdated.image = req.file.path;
      }

      res.status(200).json({
        success: true,
        message: "Featured Blog updated successfully!",
        featuredBlogUpdated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to update your Featured Blog!",
      });
    }
  },
];

// Delete featured blog
exports.deleteFeaturedBlog = async (req, res) => {
  try {
    const featuredBlog = await FeaturedBlog.findById(req.params.id);
    if (!featuredBlog) {
      return res.status(404).json({
        success: false,
        message: "Featured Blog not found!",
      });
    }

    await featuredBlog.remove();

    res.status(200).json({
      success: true,
      message: "Featured Blog deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete the Featured Blog!",
    });
  }
};
