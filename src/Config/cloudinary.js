const cloudinary = require("cloudinary").v2;
require("dotenv").config()
// Configuration
cloudinary.config({
	cloud_name: "djj1s3q4n",
	api_key: process.env.CLOUDIFAY_KEY,
	api_secret: process.env.CLOUDIFAY_SECRET
});

module.exports = {cloudinary};