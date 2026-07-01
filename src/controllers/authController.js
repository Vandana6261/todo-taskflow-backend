import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { generateOtp } from "../utils/generateOtp.js";
import * as userService from "../services/userService.js";
import seedDefaultCategories from "../seed/seedCategories.js";
import {
  saveOtp,
  sendOtpEmail,
  deleteOldOtp,
  validateOtp,
} from "../services/otpService.js";
import Otp from "../models/otp.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
import { AppError } from "../utils/AppError.js";
// import {User} from "../models/user.js"

console.log("authController called");

export const saveUserInfo = async (req, res, next) => {
  const { otp, ...userData } = req.body;

  const user = await userService.saveUserInfo(userData);
  const userId = user._id;
  await seedDefaultCategories(userId);

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest("hex")
  await userService.updateTokenToDB(userId, hashedToken);

  res.cookie("accessToken", accessToken, {
    ...getCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...getCookieOptions(),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Your account created successfully",
    user: {
      name: `${user.firstName} ${user.lastName}`,
    },
  });
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Email is required", 400);
  }
  const isUser = await userService.isUserExists(email);

  await deleteOldOtp(email);

  const otp = generateOtp();
  const isOtpSaved = await saveOtp(otp, email);
  const isOtpSend = await sendOtpEmail(email, otp);
  if (!isOtpSend.success) {
    await deleteOldOtp(email);
    return res.status(500).json(isOtpSend);
  }

  res.status(200).json({ success: true, message: "OTP sent successfully" });
};

export const varifyOTPAndSignup = async (req, res, next) => {
  const { otp, email } = req.body;
  if (!email || !otp) {
    throw new AppError("Email and OTP are required.", 400);
  }
  await validateOtp(email, otp);
  next();
};

export const login = async (req, res, next) => {
  try {
    console.log("Login");
    const response = await userService.login(req.body);

    if (!response.success) {
      res.status(401).json({ message: response.message });
    }

    const accessToken = generateAccessToken(response.user.id);
    const refreshToken = generateRefreshToken(response.user.id);
    res.cookie("accessToken", accessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...getCookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const isUpdatedRefreshTokenInDB = userService.updateTokenToDB(response.user.id, refreshToken);

    return res.status(200).json({
      success: true,
      user: {
        name: `${response.name}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    const isTokenDeleted = userService.removeTokenFromDB(req.userId)

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("getProfile called");
    const userInfo = await userService.getProfile(req.userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
