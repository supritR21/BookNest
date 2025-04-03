import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { login, logout, register, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;