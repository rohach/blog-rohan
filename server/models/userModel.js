const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  gender: {
    type: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  image: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  about: {
    type: String,
  },
  hobbies: {
    type: [String],
  },
  bio: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
