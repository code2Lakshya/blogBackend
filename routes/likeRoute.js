const express=require('express');
const router=express.Router();


const {likePost,unlikePost}=require('../controllers/like');
const {auth}=require('../middlewares/auth');

router.get('/likepost',auth,likePost);
router.put('/unlikepost',auth,unlikePost);

module.exports=router;