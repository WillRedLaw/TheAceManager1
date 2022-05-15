const { string } = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3
    },
    email:{
        type: String, 
        required: true,
        unique: true,
        max: 255,
        min: 6
    },
    password:{
        type: String, 
        required: true,
        max: 1024,
        min: 8

    },
    USB:{
        type: Boolean
    },
    USBSAVE:{
        type: String,

    },
    NFC:{
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', userSchema);