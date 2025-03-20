const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    email:{
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    
    },
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User',userSchema);
module.exports = User;