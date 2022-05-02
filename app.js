const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();

app.use(bodyParser.json());


//Listening to server
app.listen(3000);

//Import Routes

const userRoute = require('./routes/auth/auth');
const adminRoute = require('./routes/admin/admin');
app.use('/auth', userRoute);
app.use('/admin', adminRoute);

//Connect with DB

mongoose.connect( process.env.DB_CONNECT, {
    useNewUrlParser: true,
})
.then(()=>console.log('connected'))
.catch(e=>console.log(e));