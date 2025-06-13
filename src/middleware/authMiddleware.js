import Joi from "joi";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.alphanum": "Username must only contain alphanumeric characters",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must not exceed 30 characters",
      "any.required": "Username is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

export const validateFileUpload = (options = {}) => {
  const { multiple = false, maxFiles = 5, required = true } = options;

  return (req, res, next) => {
    const hasFile = req.file;
    const hasFiles = req.files && Object.keys(req.files).length > 0;
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files || {}).flat();

    // Check if files are required and missing
    if (required && !hasFile && !hasFiles) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [multiple ? "Files are required" : "File is required"],
      });
    }

    // If expecting multiple files
    if (multiple) {
      if (hasFiles && filesArray.length > maxFiles) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: [
            `Maximum ${maxFiles} files allowed, but ${filesArray.length} files provided`,
          ],
        });
      }
    } else {
      // If expecting single file
      if (hasFiles && !hasFile) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: ["Single file expected, but multiple files provided"],
        });
      }
    }

    next();
  };
};

// Predefined validators for common use cases
export const validateSingleFileUpload = validateFileUpload({
  multiple: false,
  required: true,
});
export const validateMultipleFileUpload = validateFileUpload({
  multiple: true,
  maxFiles: 5,
  required: true,
});
export const validateOptionalFileUpload = validateFileUpload({
  multiple: false,
  required: false,
});
export const validateOptionalMultipleFileUpload = validateFileUpload({
  multiple: true,
  maxFiles: 10,
  required: false,
});

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};
