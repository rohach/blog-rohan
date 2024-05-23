const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const ErrorHandler = require("../utils/errorHandler");
const upload = require("../utils/upload");
const authenticateToken = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

// Register
exports.registerUser = [
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const {
        name,
        lastName,
        email,
        password,
        dateOfBirth,
        gender,
        phone,
        role,
        about,
        hobbies,
        bio,
        image,
        coverImage,
      } = req.body;
      const userEmail = await User.findOne({ email });
      const userPhone = await User.findOne({ phone });

      if (
        !(
          name &&
          lastName &&
          email &&
          password &&
          dateOfBirth &&
          gender &&
          phone
        )
      ) {
        return next(new ErrorHandler("All fields are required!", 400));
      }

      if (userEmail) {
        return next(
          new ErrorHandler(
            "User already exists with that Email. Please try another Email!",
            400
          )
        );
      }

      if (userPhone) {
        return next(
          new ErrorHandler(
            "User already exists with that Phone Number. Please try another Phone Number!",
            400
          )
        );
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const userData = {
        name,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth,
        gender,
        image,
        coverImage,
        phone,
        role,
        about,
        hobbies,
        bio,
      };

      // if (req.files["image"]) {
      //   userData.image = req.files["image"][0].path;
      // }

      // if (req.files["coverImage"]) {
      //   userData.coverImage = req.files["coverImage"][0].path;
      // }

      const registeredUser = new User(userData);

      await registeredUser.save();

      res.status(201).json({
        success: true,
        message: "User Registered!",
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Registration Failed!", 400));
    }
  },
];

// Login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("All fields are required!", 400));
    }
    const trimmedEmail = email.trim();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return next(new ErrorHandler("You are not a Registered User!", 404));
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30m",
      });
      return res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        token,
        user: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          phone: user.role,
          image: user.image,
          coverImage: user.coverImage,
          about: user.about,
          hobbies: user.hobbies,
          bio: user.bio,
        },
      });
    } else {
      return next(new ErrorHandler("Email or password is incorrect!", 400));
    }
  } catch (error) {
    return next(
      new ErrorHandler("An unexpected error occurred during login.", 500)
    );
  }
};

// Get All user Details
exports.getAllUserDetails = async (req, res) => {
  try {
    const user = await User.find();

    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Sorry, No User Details found!",
    });
  }
};

// Get user Detail
exports.getUserDetails = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get the user!", 400));
  }
};

// Update user profile
exports.updateUserProfile = [
  authenticateToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const userId = req.user.userID;
      const {
        name,
        lastName,
        email,
        password,
        dateOfBirth,
        gender,
        phone,
        role,
        about,
        hobbies,
        bio,
      } = req.body;

      const updatedData = {
        name,
        lastName,
        email,
        dateOfBirth,
        gender,
        phone,
        role,
        about,
        hobbies,
        bio,
      };

      if (req.files["image"]) {
        updatedData.image = req.files["image"][0].path;
      }

      if (req.files["coverImage"]) {
        updatedData.coverImage = req.files["coverImage"][0].path;
      }

      if (password) {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        updatedData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler("An error occurred while updating the profile", 500)
      );
    }
  },
];

// Delete user Profile
exports.deleteUserProfile = [
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userID;
      const deletedUser = await User.findByIdAndRemove(userId);

      if (!deletedUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler("An error occurred while deleting the profile", 500)
      );
    }
  },
];

// Delete user Profile
exports.deleteUserProfile = [
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.userID;
      const deletedUser = await User.findByIdAndRemove(userId);

      if (!deletedUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return next(
        new ErrorHandler("An error occurred while deleting the profile", 500)
      );
    }
  },
];

// Get User's blog
exports.getUserBlogs = async (req, res, next) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  try {
    const blogs = await Blog.find({ user: userId }).exec();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for the user." });
    }
    res.json({ success: true, blogs });
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
};
