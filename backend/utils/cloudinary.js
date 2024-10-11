// const cloudinary = require("cloudinary").v2;
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary.
 *
 * @param {Buffer} imageBuffer - The image buffer to upload.
 * @param {Object} options - Optional Cloudinary options (e.g., folder, public_id).
 * @returns {Promise<Object>} - A promise that resolves with the Cloudinary upload result.
 */
export const uploadImage = (imageBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { ...options },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          console.log("Image uploaded successfully:", result.secure_url);
          resolve(result);
        }
      }
    );

    if (!imageBuffer) {
      reject(new Error("No image buffer provided"));
    } else {
      uploadStream.end(imageBuffer);
    }
  });
};

/**
 * Delete an image from Cloudinary.
 *
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} - A promise that resolves with the Cloudinary deletion result.
 */
export const deleteImage = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary deletion failed:", error);
        reject(new Error(`Image deletion failed: ${error.message}`));
      } else {
        console.log("Image deleted successfully:", publicId);
        resolve(result);
      }
    });
  });
};

/**
 * Extract the public ID from a Cloudinary image URL.
 *
 * @param {string} imageUrl - The Cloudinary image URL.
 * @returns {string} - The extracted public ID.
 */
export const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) {
    throw new Error("Image URL is not provided");
  }

  const segments = imageUrl.split("/");
  const publicIdWithExtension = segments[segments.length - 1]; // Get the last segment (e.g., nvcvthgsvxqe3plcsb2n.jpg)
  const publicId = publicIdWithExtension.split(".")[0]; // Remove the file extension (jpg)
  const publicIdFull = segments.slice(7, -1).join("/") + "/" + publicId; // From the 7th segment (after 'upload')

  return publicIdFull;
};

export const checkImageExists = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary resource check failed:", error);
        // You can log specific details if needed
        reject(
          new Error("Image does not exist on Cloudinary: " + error.message)
        );
      } else {
        resolve(result);
      }
    });
  });
};


