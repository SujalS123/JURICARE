const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Separate function for MongoDB connection
const connectDB = asyncHandler(async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected: ", connect.connection.name);
  } catch (error) {
    console.error("Error connecting to the database: ", error.message);
    throw new Error("Failed to connect to the database");
  }
});

// Call the connection function
connectDB();

// Routes
app.use("/api", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
