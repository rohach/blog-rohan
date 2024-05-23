const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { blogId, text, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = new Comment({
      user: user._id,
      userName: user.name,
      text,
      blogId: blogId,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Comment added!",
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment!",
    });
  }
};
// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId }).populate(
      "user",
      "name"
    );

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// Edit Comment
exports.editComment = async (req, res) => {
  try {
    const { commentId, text, userEmail } = req.body;
    // const user = await User.findById(req.user._id);

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment edited!",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to edit comment!",
    });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    await comment.remove();

    res.status(200).json({
      success: true,
      message: "Comment deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment!",
    });
  }
};
