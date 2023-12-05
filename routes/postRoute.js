const express=require('express');
const router=express.Router();


const {createPost,deletePost,getAllPost,getUserPosts,getPost}=require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.post('/createpost',auth,createPost);
router.delete('/deletepost/:post',auth,deletePost);
router.get('/getallposts',getAllPost);
router.get('/getuserposts/:userId',getUserPosts);
router.get('/getpost/:postId',getPost);


module.exports=router;