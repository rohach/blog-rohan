const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const connectDb = require("./config/connectDb");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Environment Variables Import
dotenv.config({ path: "./config/.env" });
const MONGO_URI = process.env.MONGO_URI;

// Initializing the Server
const app = express();
app.use(cors());
const PORT = process.env.PORT;
connectDb(MONGO_URI);
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importing Routes
const user = require("./routes/userRoutes");
const blog = require("./routes/blogroutes");
const contact = require("./routes/contactRoutes");
const comment = require("./routes/commentRoutes");
const featuredBlog = require("./routes/featuredBlogRoutes")

// Initializing Routes
app.use("/api/v1", user);
app.use("/api/v1", blog);
app.use("/api/v1", contact);
app.use("/api/v1", comment);
app.use("/api/v1/featuredBlog", featuredBlog);

// Middleware for Error
app.use(errorMiddleware);

app.listen(PORT, () => {
  try {
    console.log(`Server is up and running on PORT:${PORT}!`);
  } catch (error) {
    console.error(`Server encountered some problem!`);
  }
});
