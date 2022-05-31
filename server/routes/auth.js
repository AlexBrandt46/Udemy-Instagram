const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requiredLogin = require('../middleware/requireLogin')

router.post('/signup', (req, res)=>{
    const {name, email, password} = req.body
    
    if (!email || !password || !name) {
        return res.status(422).json({error:"Please add all the fields"})
    }

    User.findOne({email:email})
        .then((savedUser)=>{
            if (savedUser) {
                return res.status(422).json({error:"user already exists with that email"})
            }
            
            console.log('just before hash')

            bcrypt.hash(password, 12)
                .then(hashedpassword=>{
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name
                    })
        
                    user.save()
                        .then(user=>{
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
                        const {_id, name, email, followers, following} = savedUser
                        res.json({token, user:{_id, name, email, followers, following}})
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