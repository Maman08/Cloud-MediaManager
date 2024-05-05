const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    console.log("Connecting to the database...");
    return mongoose.connect(process.env.DATABASE_URL, {
      
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Error in connecting to the database");
        console.error(error);
        process.exit(1); // Exit the process if connection fails
    });
};
