const express=require('express');
const router=express.Router();


const {likePost,unlikePost}=require('../controllers/like');
const {auth}=require('../middlewares/auth');

router.post('/likepost',auth,likePost);
router.delete('/unlikepost/:postId',auth,unlikePost);

module.exports=router;