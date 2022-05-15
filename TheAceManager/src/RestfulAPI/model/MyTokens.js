const mongoose = require('mongoose');

const MyTokensSchema = mongoose.Schema({
    TokenID:{
        type:String,
    },

    Email:{
        type:String,
    },

    JWT:{
        type:String,
    },
    Authenticated:{
        type:Boolean,
    },
    CreatedAt:{
        type:Date,
        default: Date.now
    },


});

module.exports = mongoose.model('MyTokens', MyTokensSchema);