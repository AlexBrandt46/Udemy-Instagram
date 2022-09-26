const mongoose = require('mongoose')
const{ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    followers:[{
        type: ObjectId,
        ref: "User"
    }],
    following:[{
        type: ObjectId,
        ref: "User"
    }],
    pic:{
        type: String,
        default: "https://res.cloudinary.com/dz3kbar9h/image/upload/v1656971683/dark-souls-solaire_jchey3.jpg"
    },
    resetToken: String,
    expireToken: Date
})

mongoose.model('User', userSchema)