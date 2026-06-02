const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { generateOtp } = require("../utils/generateOtp");
const userService = require("../services/userService");
const seedDefaultCategories = require("../seed/seedCategories");
const { saveOtp, sendOtpEmail } = require("../services/otpService");
const Otp = require("../models/otp");
// const {User} = require("../models/user")

console.log("authController called");

exports.saveUserInfo = async (req, res, next) => {
  try {
    const response = await userService.saveUserInfo(req.body);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    if (response.user.isVarified) {
      return res.status(409).json({
        success: false,
        message: "User already exists, Please login first",
      });
    }
    req.userId = response.user._id;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.userId;

    const otp = generateOtp();
    const isOtp = await Otp.find({ userId });
    if (isOtp) {
      await Otp.deleteMany({ userId });
    }
    const response = await saveOtp(otp, email, userId);
    const isOtpSend = await sendOtpEmail(email, otp);
    if (!isOtpSend.success) {
      // mail haven't send
      return res.status(500).json(isOtpSend);
    }

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV == "production" ? true : false,
      sameSite: 'lax'
    }

    res.cookie('accessToken', accessToken, {
      ...cookieOptions, 
      maxAge: 15 * 60 * 1000    // 15 minute
    })

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000    // 30 days
    })

    res.status(200).json({success: true, message: "OTP sent successfully"})
  } catch (error) {
    // console.log("Error while sending otp", error)
    return res.status(500).json({ message: error.message });
  }
};

exports.varifyOTPAndSignup = async (req, res) => {
  console.log("varifyOTPAndSignup called")
  try {
    const {otp} = req.body;
    const userId = req.userId;
    
    const record = await Otp.findOne({ userId });
    
    if (!record) {
      return res.status(400).json({ success: false, message: "User don't exist" });
    }

    if (record.createdAt < new Date()) {
      await Otp.deleteMany({ userId });
      return res.status(404).json({ success: false, message: "OTP expired" });
    }
    if(otp !== record.otp) {
      return res.status(401).json({success: false, message: "Otp doesn't match"})
    } 
    const registeredUser = await userService.register(userId);

    if (!registeredUser.success) {
      return res.status(404).json(registeredUser);
    }
    
    const {user: {firstName, lastName, email} = {}} = registeredUser;
    await Otp.deleteMany({ email })     // to remove the otp after user logged in 
    await seedDefaultCategories(userId);
    return res.status(200).json({
      success: true,
      message: "Your account created successfully",
      user: {
        name: `${firstName} ${lastName}`,
        email: email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    console.log("Login");
    const response = await userService.login(req.body);
    if (!response.success) {
      res.status(401).json({ message: response.message });
    }
    console.log(response, "response")
    const accessToken = generateAccessToken(response.user.id);
    const refreshToken = generateRefreshToken(response.user.id);

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV == "production" ? true : false,
      sameSite: 'lax'
    }

    res.cookie('accessToken', accessToken, {
      ...cookieOptions, 
      maxAge: 15 * 60 * 1000    // 15 minute
    })

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000    // 30 days
    })

    return res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    
    return res.status(200).json({
        success: true,
        message: "Logout Successfully"
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.getProfile = async (req, res) => {
  try {
    console.log("getProfile called");
    const userInfo = await userService.getProfile(req.userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
