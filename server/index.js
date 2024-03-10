const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const middleware = require('./middlewares/middleware');
const session = require("express-session");

const app = express();

//serve static files from the 'files' directory
app.use('/files', express.static('files'));

app.use(
    session({ 
        secret: 'MmcmReSearch4tsussfdsoo9ew%%3', 
        resave: false, 
        saveUninitialized: true,
    })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(middleware);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch((error) => console.log('Database not connected', error));

app.use('/', require('./routes/userRoute'));
app.use('/admin', require('./routes/adminRoute'));
app.use('/capstone', require('./routes/capstoneRoute'));
app.use('/capstone-search-history', require('./routes/capstoneSearchHistoryRoute'));

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
