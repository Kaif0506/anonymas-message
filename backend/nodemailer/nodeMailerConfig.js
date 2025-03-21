const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",  
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM, 
    pass: process.env.EMAIL_PASS   
  },
});

module.exports = transporter;
