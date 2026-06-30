import nodemailer from "nodemailer";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import Otp from "../models/otp.js";
import { AppError } from "../utils/AppError.js";

const saveOtp = async (otp, email) => {
  // console.log("otp saved service called");
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
  });
  return newOtp;
};

const sendOtpEmail = async (email, otp) => {
  const res = await fetch(process.env.MAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "server-key": process.env.MAIL_SERVER_KEY,
      "server-address": process.env.MAIL_SERVER_ADDRESS,
    },
    body: JSON.stringify({
      email: email,
      otp: otp,
    }),
  });
  const payload = await res.json();
  if (!payload)
    throw new AppError("Failed to send OTP. Please try again later.", 500);

  return payload;
};

const deleteOldOtp = async (email) => {
  const isOtp = await Otp.find({ email });
  if (isOtp) {
    const isDeleted = await Otp.deleteMany({ email });
  }
  return;
};

const validateOtp = async (email, otp) => {
  const savedOtp = await Otp.findOne({ email });
  if (!savedOtp) throw new AppError("Otp has expired", 410)
  if (otp !== savedOtp.otp) {
    throw new AppError("Invalid OTP.", 400);
  }
  return true;
};

export { saveOtp, sendOtpEmail, deleteOldOtp, validateOtp };
