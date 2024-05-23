const {
  addComment,
  editComment,
  deleteComment,
  getAllComments,
} = require("../controllers/commentController");

const router = require("express").Router();

// Add Comment
router.route("/addComment").post(addComment);

// Edit a Comment
router.route("/comment/:id").put(editComment);

// Delete a Comment
router.route("/comment/:id").delete(deleteComment);

// Get all Comments
router.route("/comments").get(getAllComments);

module.exports = router;
