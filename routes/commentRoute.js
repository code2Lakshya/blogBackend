const express=require('express');
const router=express.Router();

const {createComment,deleteComment,editComment}=require('../controllers/comment');
const {auth}=require('../middlewares/auth');

router.post('/createcomment',auth,createComment);
router.delete('/deletecomment/:comment',auth,deleteComment);
router.put('/editcomment',auth,editComment);


module.exports=router;