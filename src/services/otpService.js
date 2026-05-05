const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

const saveOtp = async (otp, email) => {
  console.log("otp saved");
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  console.log(newOtp, "newOtp");
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

    exports.sendOtp = async (email, otp) => {
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your signUp otp",
        html: `<h3>Your otp is ${otp} </h3> <p>Valid for 5 minutes </p>`,
      };
      return transporter.sendMail(mailOptions);
    };

    const response = await this.sendOtp(email, otp);
    console.log(response);
    return response;
    // return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveOtp,
  sendOtpEmail,
};
