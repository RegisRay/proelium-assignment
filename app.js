const express = require('express');
const mongoose = require('mongoose');

require('dotenv/config');

const app = express();

//Listening to server
app.listen(3000);

//Import Routes

const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

//Connect with DB

mongoose.connect( process.env.DB_CONNECT, ()=>{
    console.log('Connected to DB');
})