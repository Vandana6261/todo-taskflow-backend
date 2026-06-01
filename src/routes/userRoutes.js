const express = require('express');

const router = express.Router();
const { createUser } = require('../controllers/userController')
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware")
const { varifyToken } = require('../middleware/authMiddleware');

console.log("inside userRoute")
// router.post('/signUp', userController.createUser);

router.post('/send-otp', authController.saveUserInfo, authController.sendOtp)
router.post("/login", authController.login);

router.post('/refresh', authMiddleware.handleReferesh)

router.use(varifyToken)

router.post('/varifyOtp', authController.varifyOTPAndSignup)
// router.post("/register", authController.register);


router.get("/profile", authController.getProfile);

module.exports = router;