const Comment=require('../models/commenntSchema');
const Post=require('../models/postSchema');

exports.createComment=async(req,res)=>{
    try{
        const {user,post,content}=req.body;
        const validatePost=await Post.findOne({_id:post});
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

