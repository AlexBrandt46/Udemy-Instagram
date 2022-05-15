const { json } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")

router.get('/user/:id', (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password") // Makes sure the user's password isn't returned in the response
    .then(user => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if (err) {
                return res.status(422).json({error: err})
            }
            else {
                return json({user, posts})
            }
        })
    }).catch(err => {
        return res.status(404).json({error: "User not found"})
    })
})


module.exports = router