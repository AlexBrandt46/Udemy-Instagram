const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next)=>{
    const {authorization} = req.headers

    // If the authorization object doesn't exist then we know the user hasn't logged in yet because it's added to the HTTP header when an API call is made that requires the login info
    if (!authorization) {
        res.status(401).json({error:'you must be logged in'})
    }

    // Replace bearer with empty space to be able to access only token because authentication looks like the string below
    // authorization === Bearer eqjklfdjkl;ajkl (token)
    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if (err) {
            return res.status(401).json({error:'You must be logged in'})
        }

        const {_id} = payload
        User.findById(_id)
            .then(userData=>{
                req.user = userData
                next() // function used to execute the middleware succeeding the current middleware
            })
    })
}