const multer = require("multer");

// Configure multer storage (in-memory for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
