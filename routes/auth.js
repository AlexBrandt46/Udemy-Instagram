const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET, SENDGRID_KEY} = require('../config/keys')
const requiredLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// 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

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_KEY
    }
}))

router.post('/signup', (req, res)=>{
    const {name, email, password, pic} = req.body
    
    if (!email || !password || !name) {
        return res.status(422).json({error:"Please add all the fields"})
    }

    User.findOne({email:email})
        .then((savedUser)=>{
            if (savedUser) {
                return res.status(422).json({error:"user already exists with that email"})
            }
            
            bcrypt.hash(password, 12)
                .then(hashedpassword=>{
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name,
                        pic
                    })
        
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "testprofile3155@gmail.com",
                                subject: "Signup Success",
                                html: "<h1>Welcome to the Udemy Instagram clone!</h1>"
                            })
                            res.json({message:"saved successfully"})
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
        })
        .catch(err=>{
            console.log(err)
        })

})

router.post('/login', (req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        res.status(422).json({error:"please provide an email and password"})
    }

    User.findOne({email:email})
        .then(savedUser=>{
            // Check for if there's not a user with this email
            if (!savedUser) {
                return res.status(422).json({error:"Invalid email or password"})
            }

            bcrypt.compare(password, savedUser.password)
                .then(match=>{
                    // If the passwords match
                    if (match) {
                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        const {_id, name, email, followers, following, pic} = savedUser
                        res.json({token, user:{_id, name, email, followers, following, pic}})
                    }
                    else {
                        return res.status(422).json({error:"Invalid password"})
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        })
})

router.get('/protected', requiredLogin, (req, res)=>{
    res.send("hello user")
})

module.exports = router