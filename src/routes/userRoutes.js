import express from 'express';

import * as authController from "../controllers/authController.js";
import { 
    saveUserInfo,
    sendOtp,
    login,
    varifyOTPAndSignup,
    logout,
    getProfile
} from "../controllers/authController.js"
import { varifyToken, handleReferesh } from '../middleware/authMiddleware.js';
import rateLimit from "express-rate-limit";

const router = express.Router();

console.log("inside userRoute")

const authRouterLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'local' ? 1000 : 20,
    message: "Too many authentication attempts from this IP, please try again after 1 hour"
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'local' ? 1000 : 5, // High limit for local testing
    message: "Too many authentication attempts from this IP, please try again after 15 minutes"
});

router.use(authRouterLimiter);

router.post('/send-otp', authLimiter, saveUserInfo, sendOtp)
router.post("/login", authLimiter, login);
router.post('/refresh', handleReferesh);

router.use(varifyToken)

router.post('/varifyOtp', authLimiter, varifyOTPAndSignup)
router.post('/logout', authLimiter, logout)


router.get("/me", getProfile);

export default router;