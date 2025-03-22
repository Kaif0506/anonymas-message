require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/router");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Serve static frontend files (Ensure "build" folder is correctly placed in the backend directory)
app.use(express.static(path.join(__dirname, "build")));

// ✅ API Routes
app.use("/api", router);

// ✅ Handle all unknown routes and serve React frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Simple test route
app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

// ✅ Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
