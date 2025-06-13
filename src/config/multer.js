import multer from "multer";

const defaultImageConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  errorMessage: "Only JPG, JPEG, PNG, and WebP images are allowed!",
};

/**
 * Create a multer middleware for image uploads to Cloudinary
 * @param {Object} options - Configuration options
 * @param {number} options.maxFileSize - Maximum file size in bytes (default: 5MB)
 * @param {string[]} options.allowedMimeTypes - Array of allowed image MIME types
 * @param {string} options.errorMessage - Custom error message for invalid files
 * @returns {multer.Multer} Configured multer instance for memory storage
 */
export const createImageUpload = (options = {}) => {
  const config = { ...defaultImageConfig, ...options };

  return multer({
    storage: multer.memoryStorage(), // Memory storage for Cloudinary
    limits: {
      fileSize: config.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (config.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(config.errorMessage), false);
      }
    },
  });
};

// Predefined image upload configurations
export const profileImageUpload = createImageUpload({
  maxFileSize: 2 * 1024 * 1024, // 2 MB for profile images
});

export const postImageUpload = createImageUpload({
  maxFileSize: 10 * 1024 * 1024, // 10 MB for post images
});

export const thumbnailUpload = createImageUpload({
  maxFileSize: 1 * 1024 * 1024, // 1 MB for thumbnails
  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg"], // No WebP for thumbnails
});