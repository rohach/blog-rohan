const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/.env" });
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return next(new ErrorHandler("Authorization token is required", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(new ErrorHandler("Invalid or expired token", 403));
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
