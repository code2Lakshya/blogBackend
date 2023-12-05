const express=require('express');
const router=express.Router();


const {createPost,deletePost}=require('../controllers/post');
const { auth } = require('../middlewares/auth');

router.post('/createpost',auth,createPost);
router.delete('/deletepost/:post',auth,deletePost);


module.exports=router;