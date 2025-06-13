import express from "express";
import { login, logout, register, uploadProfileImageHandler } from "../controllers/authController.js";
import {
  authenticateToken,
  validateLogin,
  validateRegistration,
  validateSingleFileUpload,
} from "../middleware/authMiddleware.js";
import { profileImageUpload } from "../config/multer.js";
const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.put(
  "/update-profile-image",
  authenticateToken,
  profileImageUpload.single("profileImage"),
  validateSingleFileUpload,
  uploadProfileImageHandler
);
router.post("/logout", authenticateToken, logout);

export default router;
