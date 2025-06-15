import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "../.env"});
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

const defaultUploadOptions = {
  folder: "uploads",
};

/**
 * Upload image to Cloudinary with configurable options
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Upload configuration options
 * @param {string} options.folder - Cloudinary folder name
 * @param {string} options.publicId - Custom public ID for the image
 * @param {string} options.quality - Image quality (auto, best, good, eco, low)
 * @param {number} options.width - Maximum width
 * @param {number} options.height - Maximum height
 * @param {string} options.crop - Crop mode (limit, fill, scale, fit, etc.)
 * @param {Object} options.transformation - Additional transformation options
 * @returns {Promise<Object>} Upload result with url and public_id
 */
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    const config = { ...defaultUploadOptions, ...options };

    const fileBase64 = fileBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${fileBase64}`;

    const uploadOptions = {
      folder: config.folder,
      resource_type: "image",
    };

    if (config.publicId) {
      uploadOptions.public_id = config.publicId;
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @param {Object} options - Delete configuration options
 * @param {string} options.resourceType - Resource type (default: "image")
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const config = { resourceType: "image", ...options };

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: config.resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @param {Object} options - Delete configuration options
 * @returns {Promise<Object>} Delete result
 */

export const deleteMultipleFromCloudinary = async (publicIds, options = {}) => {
  try {
    const config = { resourceType: "image", ...options };

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: config.resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary:", error);
    throw new Error("Failed to delete images");
  }
};

// Predefined upload configurations for common use cases
export const uploadProfileImage = (fileBuffer, publicId) =>
  uploadToCloudinary(fileBuffer, {
    folder: "profiles",
    width: 500,
    height: 500,
    crop: "fill",
    quality: "auto",
    publicId,
  });

export const uploadPostImage = (fileBuffer) =>
  uploadToCloudinary(fileBuffer, {
    folder: "posts",
    width: 1200,
    height: 800,
    crop: "limit",
    quality: "auto",
  });

export const uploadThumbnail = (fileBuffer) =>
  uploadToCloudinary(fileBuffer, {
    folder: "thumbnails",
    width: 300,
    height: 200,
    crop: "fill",
    quality: "good",
  });

export default cloudinary;
