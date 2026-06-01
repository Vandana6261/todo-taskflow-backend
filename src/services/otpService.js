const nodemailer = require("nodemailer");
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const Otp = require("../models/otp");

const saveOtp = async (otp, email, userId) => {
  console.log("otp saved service called");
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
    userId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });
  console.log(newOtp, "newOtp");
  return newOtp;
};

const sendOtpEmail = async (email, otp) => {
  try {
    console.log("sendOtpEmail service called")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // port: 465,
      port: 587,
      // secure: true,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // tls: {
      //   rejectUnauthorized: false
      // },
      // family: 4
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
