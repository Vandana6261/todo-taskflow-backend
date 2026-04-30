const express = require('express');

const router = express.Router();
const { createUser } = require('../controllers/userController')
const authController = require("../controllers/authController");
const { varifyToken } = require('../middleware/authMiddleware');

console.log("inside userRoute")
// router.post('/signUp', userController.createUser);
router.post("/register", authController.register);
router.post("/login", authController.login);

router.use(varifyToken)

router.get("/profile", authController.getProfile);

module.exports = router;