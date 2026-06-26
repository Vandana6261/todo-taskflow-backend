const express = require('express');

const { createUser } = require('../controllers/userController')
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware")
const { varifyToken } = require('../middleware/authMiddleware');
const rateLimit = require("express-rate-limit");

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

router.post('/send-otp', authLimiter, authController.saveUserInfo, authController.sendOtp)
router.post("/login", authLimiter, authController.login);
router.post('/refresh', authMiddleware.handleReferesh);

router.use(varifyToken)

router.post('/varifyOtp', authLimiter, authController.varifyOTPAndSignup)
router.post('/logout', authLimiter, authController.logout)


router.get("/me", authController.getProfile);

module.exports = router;