/*
    This is the server file it sets up the application 
*/

//REQUIREMENTS
const express = require('express');
const session = require('express-session');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const cors = require('cors');

//Import Routes
const authRoute = require('./routes/auth');

// ENV file imports for application. 
dotenv.config();
PORT = process.env.PORT

//Connection to DB
mongoose.connect(process.env.DB_CONNECT, 
()=>console.log('Connected to MongoDB'));

//Start Session
//Creating Storage Session
const store = new MongoDBSession({
    uri:process.env.DB_CONNECT,
    collection: 'MySessions',

});

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
  });

//Session middleware
app.use(session({
    cookieName: 'COOKIE',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {

      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true, 

    }
    
}));

//middleware
app.use(express.json()); 

//Router Middleware
app.use('/api/user', authRoute);
app.listen(PORT, () => console.log('Server is up and running'))