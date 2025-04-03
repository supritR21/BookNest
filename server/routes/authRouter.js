import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { updatePassword, resetPassword, forgotPassword, getUser, login, logout, register, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/forgot/password", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;