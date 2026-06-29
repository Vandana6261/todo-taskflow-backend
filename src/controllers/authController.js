import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { generateOtp } from "../utils/generateOtp.js";
import * as userService from "../services/userService.js";
import seedDefaultCategories from "../seed/seedCategories.js";
import { saveOtp, sendOtpEmail, deleteOldOtp, validateOtp } from "../services/otpService.js";
import Otp from "../models/otp.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
// import {User} from "../models/user.js"

console.log("authController called");

export const saveUserInfo = async (req, res, next) => {
  console.log("Save user info called")
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
        return res.status(409).json({success: false, message: "User already exists please login"})
      }
      else {
        req.userId = isUser._id;
      }
    }

    next();
  } catch (err) {
    next(err)
  }
};

export const sendOtp = async (req, res) => {
  console.log("send otp called")
  try {
    const { email } = req.body;
    const userId = req.userId;

    const otp = generateOtp();
    await deleteOldOtp();

    const response = await saveOtp(otp, email, userId);
    const isOtpSend = await sendOtpEmail(email, otp);
    if (!isOtpSend.success) {
      return res.status(500).json(isOtpSend);
    }

    // const accessToken = generateAccessToken(userId);
    // const refreshToken = generateRefreshToken(userId);

    // res.cookie('accessToken', accessToken, { ...getCookieOptions, maxAge: 15 * 60 * 1000 });
    // res.cookie('refreshToken', refreshToken, { ...getCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const varifyOTPAndSignup = async (req, res) => {
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

 

export const login = async (req, res) => {
  try {
    console.log("Login");
    const response = await userService.login(req.body);

    if (!response.success) {
      res.status(401).json({ message: response.message });
    }
    
    const accessToken = generateAccessToken(response.user.id);
    const refreshToken = generateRefreshToken(response.user.id);


    res.cookie('accessToken', accessToken, {...getCookieOptions, maxAge: 15 * 60 * 1000 })

    res.cookie('refreshToken', refreshToken, {...getCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })

    return res.status(200).json({
      success: true,
      user: {
         name: `${response.name}`,
      } 
    });

  } catch (error) {
    next(error)
  }
};

export const logout = async (req, res) => {
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

export const getProfile = async (req, res) => {
  try {
    console.log("getProfile called");
    const userInfo = await userService.getProfile(req.userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
