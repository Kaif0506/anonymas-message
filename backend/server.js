
require("dotenv").config();
// const { config } = require('dotenv');
const express = require('express')
const mongoose = require('mongoose');
const router = require('./routes/router')
const cors = require('cors');
const path = require("path");




const app = express()

app.use(cors());  // Enable CORS for all routes

app.use(express.json()) 

app.use(express.static(path.join(__dirname, "build"))); // Adjust the folder if needed
app.use(express.static(path.resolve(__dirname, "build")));


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.log(err));

app.use('/api', router);
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
app.get('/hello',(req,res)=>{
    res.send('Hello World!')
})

const PORT = process.env.PORT || 6000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
