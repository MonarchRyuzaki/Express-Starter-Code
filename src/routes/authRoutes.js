import { Router } from "express";
const router = Router();
import { register, login, getProfile, updateProfile, changePassword, logout } from "../controllers/authController.js";

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  validatePasswordChange,
  changePassword
);
router.post("/logout", authenticateToken, logout);

export default router;
