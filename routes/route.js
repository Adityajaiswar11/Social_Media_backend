const express = require('express');
const { signup, login ,post, alluserPost, updatePostbyid, deletePostbyid, getPostbyUserName, getPostbyId, adminApproved, postlikes, postDislikes, getLikePostbyusers, getdisLikePostbyusers} = require('../controller/auth');
const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/post/:name",post) 
router.get("/post/:name",alluserPost) 
router.get("/user/:id",getPostbyUserName) 
router.post("/update/:id",updatePostbyid)
router.post("/updateadmin/:id",adminApproved)
router.delete("/delete/:id/:userId",deletePostbyid)

router.get("/updatepost/:id",getPostbyId)

router.post("/likes/:postId/:userId",postlikes)
router.post("/dislike/:postId/:userId", postDislikes)

router.get("/likeusers/:postId",getLikePostbyusers)
router.get("/dislikeusers/:postId",getdisLikePostbyusers )


module.exports = router;