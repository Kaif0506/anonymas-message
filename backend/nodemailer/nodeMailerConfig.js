const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",  
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "kaifclg2023@gmail.com", 
    pass: "ldkm uyqg qoyy yndl",   
  },
});

module.exports = transporter;
