const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");
const { generateOtp } = require("../utils/generateOtp");
const userService = require("../services/userService");
const seedDefaultCategories = require("../seed/seedCategories");
const { saveOtp, sendOtpEmail } = require("../services/otpService");
const Otp = require("../models/otp");
// const {User} = require("../models/user")

console.log("authController called");

exports.saveUserInfo = async (req, res, next) => {
  try {
    console.log("save User Info called");
    const response = await userService.saveUserInfo(req.body);
    console.log(response, "response");
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    if (response.user.isVarified) {
      return res.status(409).json({
        success: false,
        message: "User already exists, Please login first",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    console.log("send Otp called");
    const { email } = req.body;

    const otp = generateOtp();
    const isOtp = await Otp.find({ email });
    if (isOtp) {
      await Otp.deleteMany({ email });
    }
    const response = await saveOtp(otp, email);
    const isOtpSend = await sendOtpEmail(email, otp);
    if (isOtpSend.accepted.length === 0) {
      // mail haven't send
      throw new Error("Email not sent");
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error, "error 63");
    return res.status(500).json({ message: error.message });
  }
};

exports.varifyOTPAndSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    console.log(record.expiresAt - new Date(), "time difference");

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    const registeredUser = await userService.register(email);

    if (!registeredUser.success) {
      return res.status(404).json(registeredUser);
    }
    // await Otp.deleteMany({ email });

    const {user: {_id: userId, firstName, lastName} = {}} = registeredUser
    console.log(userId, firstName, lastName, email, 94);
    // return res.json(registeredUser);

    await seedDefaultCategories(userId);

    const token = generateToken(userId);
    return res.status(200).json({
      success: true,
      message: "Your account created successfully",
      token,
      user: {
        id: userId,
        name: `${firstName} ${lastName}`,
        email: email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    console.log("Login");
    const response = await userService.login(req.body);
    if (!response.success) {
      res.status(400).json({ message: response.message });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log("getProfile called");
    console.log(req.userId);
    const userInfo = await userService.getProfile(req.userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
