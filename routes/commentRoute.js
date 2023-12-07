const express=require('express');
const router=express.Router();

const {createComment,deleteComment,editComment}=require('../controllers/comment');


router.post('/createcomment',createComment);
router.delete('/deletecomment/:comment',deleteComment);
router.put('/editcomment',editComment);


module.exports=router;