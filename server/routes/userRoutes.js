const {
  registerUser,
  loginUser,
  getAllUserDetails,
  getUserDetails,
  updateUserProfile,
  getUserBlogs,
  deleteUserProfile,
} = require("../controllers/userController");

const router = require("express").Router();

// Resister a User
router.route("/register").post(registerUser);

// Login
router.route("/login").post(loginUser);

// Get All Users
router.route("/users").get(getAllUserDetails);

// Get User Detail
router.route("/user/:id").get(getUserDetails);

// Update User Detail
router.route("/user/:id").put(updateUserProfile);

// Get User Blogs
router.route("/user/:userId/blogs").get(getUserBlogs);

// Delete User Detail
router.route("/user/:id").delete(deleteUserProfile);

module.exports = router;
