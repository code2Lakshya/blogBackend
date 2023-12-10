const express=require('express');
const router=express.Router();


const {createPost,deletePost,getAllPost,getUserPosts,getPost,getRandomPost}=require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.post('/createpost',auth,createPost);
router.delete('/deletepost/:post',auth,deletePost);
router.get('/allposts',getAllPost);
router.get('/userposts/:userId',getUserPosts);
router.get('/post/:postId',getPost);
router.get('/randompost',getRandomPost);


module.exports=router;