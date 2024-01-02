const express=require('express');
const router=express.Router();

const {createComment,deleteComment,editComment,getAllComments}=require('../controllers/comment');
const {auth}=require('../middlewares/auth');

router.post('/createcomment',auth,createComment);
router.delete('/deletecomment/:comment',auth,deleteComment);
router.put('/editcomment',auth,editComment);
router.get('/getallcomments',auth,getAllComments);


module.exports=router;