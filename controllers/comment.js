const Comment=require('../models/commenntSchema');
const Post=require('../models/postSchema');

exports.createComment=async(req,res)=>{
    try{
        const {post,content}=req.body;
        const validatePost=await Post.findOne({_id:post});
        const user=req.userId;
        if(!validatePost){
            res
            .status(400)
            .json({
                success: false,
                message: 'Invalid Post'
            })
        }
        if(!content){
            res
            .status(400)
            .json({
                success: false,
                message: 'Content Required'
            })
        }
        const comment=await Comment.create({user,post,content});
        const addToPost=await Post.updateOne({_id:post},{$push: {comments: comment._id}},{new: true})
        .populate('comments')
        .exec();
        res
        .status(200)
        .json({
            success: true,
            message: 'Comment Added',
            response: comment
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: 'Comment created'
        })
    }
}

exports.deleteComment=async(req,res)=>{
    try{
        const {comment}=req.params;
        const validateComment=await Post.findOne({_id:comment});
        if(!validateComment){
            res
            .status(400)
            .json({
                success: false,
                message: 'Invalid Comment Id'
            })
        }
        const deleteComment=await Comment.deleteOne({_id: comment});
        res
        .status(200)
        .json({
            success: true,
            response: deleteComment,
            message: 'Comment Successfully Deleted'
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

exports.editComment=async(req,res)=>{
    try{
        const {comment,content}=req.body;
        const user=req.userId;
        if(!comment){
            req
            .status(400)
            .json({
                success: false,
                message: 'Content invalid'
            })
        }
        const validateComment=await Comment.findOne({_id: comment,user});
        if(!validateComment){
            res
            .status(400)
            .json({
                success: false,
                message: 'Invalid Comment Id'
            })
        }
        const updatedComment=await Comment.findOneAndUpdate({_id:comment},{content},{new: true});
        res
        .status(200)
        .json({
            success: true,
            message: 'Comment edited Successfully',
            response: updatedComment
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: "Internal Server Error"
        })
    }
}