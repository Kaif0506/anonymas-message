require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Message = require("../models/messageSchema");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../nodemailer/nodeMailerConfig");

const otpStore = {};
const generateOtp = ()=> Math.floor(100000 + Math.random() * 900000).toString();

router.get("/helloworld", (req, res) => {
  res.send("Hello World");
});
router.post("/generate", async (req, res) => {
  try {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const Newuser = new User({
      username,
      email,
      password: hashedPassword,
      uniqueId,
    });
    const token = jwt.sign({ uniqueId: uniqueId }, process.env.JWT_SECRET);
    await Newuser.save();
    res.json({
      link: `https://anonymas-message-1.onrender.com/user/${uniqueId}`,
      uniqueId,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "" });
  }
});

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Token verification failed" });
  }
};

router.get("/user", auth, async (req, res) => {
  try {
    const ID = req.user.uniqueId;
    const user = await User.findOne({ uniqueId: ID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "There is an error to fetch the user details" });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content)
      return res.status(400).json({ message: "Missing data" });
    const encryptedContent = CryptoJS.AES.encrypt(
      content,
      process.env.CRYPTO_SECRET
    ).toString();
    const message = new Message({ userId, content: encryptedContent });
    await message.save();
    res.json({ message: "Message send successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error sending the message" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });  // Use 'error' key for consistency
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ uniqueId: user.uniqueId }, process.env.JWT_SECRET);

    res.json({
      token,
      link: `https://anonymas-message-1.onrender.com/${user.uniqueId}`,
      message: "Login successful!", // Now sending success message
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.get("/messages", auth, async (req, res) => {
  try {
    const userId = req.user.uniqueId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const messages = await Message.find({ userId });

    const decryptedMessages = messages.map((msg) => ({
      _id: msg._id, // Include _id to identify each message
      decryptedMessage: CryptoJS.AES.decrypt(msg.content, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8),
    }));

    res.json(decryptedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching the messages" });
  }
});


router.delete("/messages/:id", auth, async (req, res) => {
  try {
    const userId = req.user.uniqueId;
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });

    
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Error deleting the message" });
    
  }

})

router.post("/password-reset",async (req,res)=>{
  try {
    const {email,newPassword} = req.body;
    const user = await User.findOne({email:email});
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();  
    res.json({ message: "Password reset successfully" });
    
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching the user" });
    
  }

})

router.post("/forgot-password",async(req,res)=>{
  try {
    const {email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOtp();
    otpStore[email] = {otp,expiresAt: Date.now() + 5 * 60 * 1000};

    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // replace with your email
      to:email,
      subject:"Your OTP for Password Reset",
      text:`Your OTP for password reset is ${otp}. It is valid for 5 Miniutes`,
    })

    // console.log(otpStore,otp);
    

    res.json({ message: "OTP sent successfully" });

    
  } catch (error) {
    console.error("Error sending reset password link:", error);
    res.status(500).json({ error: "Error sending the reset password link" });
    
  }

})

router.post("/verify-otp",async(req,res)=>{
  try {
    const {email,otp} = req.body;
    if(!otpStore[email] || otpStore[email].expiresAt< Date.now()){
      return res.status(400).json({ message: "OTP expired or invalid" });
    }
    if(otpStore[email].otp!==otp){
      return res.status(400).json({ message: "OTP does not match" });
    }
    delete otpStore[email];
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Error verifying the OTP" });
    
  }
})
// drfd teod mujf qedp
module.exports = router;
