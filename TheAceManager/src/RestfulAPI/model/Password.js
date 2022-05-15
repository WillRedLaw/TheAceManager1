const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    passwordUserID:{
        type: String,
        required: true
    },
    passwordTitle:{
        type: String,
        required: true,
        min: 6
    },
    password:{
        type: String, 
        required: true,
        min: 8,
        max: 1024
    },
    iv:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Password', passwordSchema);