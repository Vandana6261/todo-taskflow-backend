const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

const saveOtp = async (otp, email, userId) => {
  console.log("otp saved");
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
    userId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });
  return newOtp;
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your signUp otp",
      html: `<h3>Your otp is ${otp} </h3> <p>Valid for 5 minutes </p>`,
    };
    
    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  saveOtp,
  sendOtpEmail,
};
