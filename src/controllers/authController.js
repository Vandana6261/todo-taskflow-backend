const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { generateOtp } = require("../utils/generateOtp");
const userService = require("../services/userService");
const seedDefaultCategories = require("../seed/seedCategories");
const { saveOtp, sendOtpEmail, deleteOldOtp, validateOtp } = require("../services/otpService");
const Otp = require("../models/otp");
// const {User} = require("../models/user")

console.log("authController called");

exports.saveUserInfo = async (req, res, next) => {
  try {
    const userData = req.body;
    const isUser = await userService.isUserExists(userData.email);
    let user;

    if(!isUser) {
      user = await userService.saveUserInfo(userData);
      req.userId = user._id;
    }

    if(isUser) {
      if(isUser.isVarified) {
        res.status(409).json({success: false, message: "User already exists please login"})
      }
      else {
        req.userId = isUser._id;
      }
    }

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
    await deleteOldOtp();

    const response = await saveOtp(otp, email, userId);
    const isOtpSend = await sendOtpEmail(email, otp);
    if (!isOtpSend.success) {
      // mail haven't send
      return res.status(500).json(isOtpSend);
    }

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    console.log("NODE_ENV =", process.env.NODE_ENV);

    console.log({
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
    });

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV == "production" ? true : false,
      sameSite: process.env.NODE_ENV == "production" ? 'none' : 'lax',
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
  try {
    const {otp} = req.body;
    const userId = req.userId;

    let isValidate = await validateOtp(userId, otp);

    if(!isValidate.success) {
      console.log(isValidate, "isValidate")
      if(isValidate.message == "expired") {
        return res.status(410).json(isValidate);
      }
      else {
        return res.status(400).json(isValidate);
      }
    }

    const registeredUser = await userService.register(userId);

    if (!registeredUser.success) {
      return res.status(404).json(registeredUser);
    }
    
    const {user: {firstName, lastName, email} = {}} = registeredUser;
    
    await deleteOldOtp(userId);

    await seedDefaultCategories(userId);
    
    return res.status(200).json({
      success: true,
      message: "Your account created successfully",
      user: {
        name: `${firstName} ${lastName}`,
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
    
    const accessToken = generateAccessToken(response.user.id);
    const refreshToken = generateRefreshToken(response.user.id);

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV == "production" ? true : false,
      sameSite: process.env.NODE_ENV == "production" ? 'none' : 'lax'
    }

    res.cookie('accessToken', accessToken, {
      ...cookieOptions, 
      maxAge: 15 * 60 * 1000    // 15 minute
    })

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000    // 30 days
    })

    return res.status(200).json({
      success: true,
      user: {
         name: `${response.name}`,
      } 
    });

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
