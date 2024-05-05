// express server setup
const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file

// Port
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}));

// Database call
const database = require("./config/database").connect();

// Cloudinary call
const cloudinarydb = require("./config/cloudinary").cloudinaryConnect();

// Route
const upload = require("./routes/index");
app.use("/api/v1/upload", upload);

// Listen
app.listen(PORT, () => console.log("Server is running successfully at PORT ", PORT));
