const express = require("express");
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')

mongoose.connect(
    'mongodb://localhost:27017/jwtDb', 
    {useNewUrlParser : true, useUnifiedTopology:true},
    () => {        
        console.log("Successfully Connected Mongodb");
})

app.use(express.json());

app.use('/api/auth', authRoute)

app.listen(3000, () => {
    console.log("Backed server is running!");
})