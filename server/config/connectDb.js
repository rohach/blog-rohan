const mongoose = require("mongoose");

const connectDB = async (MONGO_URI) => {
  try {
    const DB_OPTIONS = {
      dbName: "Blog",
    };
    mongoose.connect(MONGO_URI, DB_OPTIONS);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to the database!");
  }
};

module.exports = connectDB;
