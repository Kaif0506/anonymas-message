
require("dotenv").config();
// const { config } = require('dotenv');
const express = require('express')
const mongoose = require('mongoose');
const router = require('./routes/router')
const cors = require('cors');



const app = express()

app.use(cors());  // Enable CORS for all routes

app.use(express.json()) 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.log(err));

app.use('/api', router);
app.get('/hello',(req,res)=>{
    res.send('Hello World!')
})

const PORT = process.env.PORT || 6000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
