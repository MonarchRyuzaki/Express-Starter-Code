import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

const defaultUploadOptions = {
  folder: "uploads",
  quality: "auto",
  fetch_format: "auto",
  crop: "limit",
  width: 2000,
  height: 2000,
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

    // Convert buffer to base64
    const fileBase64 = fileBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${fileBase64}`;

    // Prepare upload options
    const uploadOptions = {
      folder: config.folder,
      resource_type: "image",
      quality: config.quality,
      fetch_format: config.fetch_format,
      crop: config.crop,
      width: config.width,
      height: config.height,
      ...config.transformation,
    };

    // Add public_id if provided
    if (config.publicId) {
      uploadOptions.public_id = config.publicId;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    // Return Cloudinary response
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

/*
=== USAGE ===

// 1. Using Database ID for Profile Images
const userId = req.user.id; // From your database (e.g., 12345)
const publicId = `user_${userId}`;
const result = await uploadProfileImage(req.file.buffer, publicId);
// Creates: public_id = "user_12345", URL: .../profiles/user_12345.jpg

// 2. Example Controller Implementation
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const publicId = `user_${userId}`;
    
    // Upload new image (replaces old one if exists)
    const result = await uploadProfileImage(req.file.buffer, publicId);
    
    // Update database with new image URL
    await User.findByIdAndUpdate(userId, {
      profileImage: result.url,
      profileImagePublicId: result.public_id
    });
    
    res.json({ success: true, imageUrl: result.url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// 3. Using Predefined Functions
const profileResult = await uploadProfileImage(fileBuffer, `user_${userId}`);
const postResult = await uploadPostImage(fileBuffer);
const thumbnailResult = await uploadThumbnail(fileBuffer);

// 4. Custom Upload with Specific Options
const customResult = await uploadToCloudinary(fileBuffer, {
  folder: 'gallery',
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'best',
  publicId: `gallery_${postId}`
});

// 5. Delete Operations
await deleteFromCloudinary(`user_${userId}`); // Delete single image
await deleteMultipleFromCloudinary([`user_${userId1}`, `user_${userId2}`]); // Bulk delete

// 6. Benefits of Using DB ID as Public ID:
// - Unique & Predictable: Database IDs are unique, so no conflicts
// - Easy Retrieval: You can construct the public ID anytime you know the user ID
// - Automatic Replacement: When user updates profile pic, same public ID overwrites the old image
// - Simple Cleanup: Easy to delete when user account is deleted
*/
