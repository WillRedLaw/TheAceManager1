const mongoose = require('mongoose');

const MySessionsSchema = new mongoose.Schema({

    SessionID:{
        type:String,
        
    },
 
    Email:{
        type:String,
        required: false
    },

    Authenticated:{
        type: Boolean,
        required: false,
    },

    createdAt: { 
        type: Date, 
        default: Date.now
        
     }, 

});

module.exports = mongoose.model('MySessions', MySessionsSchema);