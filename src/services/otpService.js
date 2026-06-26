import nodemailer from 'nodemailer';
import dns from 'dns';
dns.setDefaultResultOrder("ipv4first");

import Otp from '../models/otp.js';

const saveOtp = async (otp, email, userId) => {
  // console.log("otp saved service called");
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
    userId,
  });
  return newOtp;
};

const sendOtpEmail = async (email, otp) => {

  try {
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
    
    return payload;
  } catch (error) {
    console.error("Mailer Error Log:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const deleteOldOtp = async (userId) => {
  const isOtp = await Otp.find({ userId });
  if (isOtp) {
    await Otp.deleteMany({ userId });
  }
};

const validateOtp = async (userId, otp) => {
  
  const savedOtp = await Otp.findOne({ userId });
  
  if (!savedOtp) return { success: false, message: "expired" };
  if (otp !== savedOtp.otp) {
    return { success: false, message: "doesn't match" };
  } else {
    return { success: true, message: "Otp matched" };
  }
};

export {
  saveOtp,
  sendOtpEmail,
  deleteOldOtp,
  validateOtp,
};
