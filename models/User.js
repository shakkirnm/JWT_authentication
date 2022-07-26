const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 4,
    }
})

module.exports = mongoose.model("User", UserSchema)