const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allpost', requireLogin, (req, res)=>{
    Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/subscribedposts', requireLogin, (req, res)=>{
    // check if postedBy in following, then return the posts if true
    Post.find({postedBy: {$in: req.user.following}})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost', requireLogin, (req, res)=>{
    const {title, body, pic} = req.body

    if (!title || !body || !pic) {
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    req.user.password = undefined

    const post = new Post({
        title, 
        body,
        photo:pic,
        postedBy:req.user
    })

    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts', requireLogin, (req, res)=>{

    Post.find({postedBy:req.user._id})
        .populate("postedBy", "_id name")
        .then(myPosts=>{
            res.json({myPosts})
        })
        .catch(err=>{
            console.log(err)
        })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res)=>{
    const comment = { 
        text: req.body.text, 
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment} // push person who comments on the post with their comment
    }, 
    {
        new: true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error: error})
        }
        else {
            res.json(result)
        }
    })
})

router.delete('/deletePost/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId}) // receiving this from URL name must be same
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if (err || !post) {
            return res.status(422).json({error: err})
        }
        else if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

module.exports = router