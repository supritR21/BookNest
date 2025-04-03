import express from 'express';
import { register, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);

export default router;