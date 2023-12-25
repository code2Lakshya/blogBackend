const Like=require('../models/likeSchema');
const Post=require('../models/postSchema');

exports.likePost=async(req,res)=>{
    try{
        const {post}=req.body;
        const user=req.userId;
        const checkPost=await Like.findOne({post,user});
        if(checkPost){
            res
            .status(400)
            .json({
                success: false,
                response: 'Post already liked'
            })
        }
        const likedPost=await Like.create({
            post,user
        });
        const addLikeToPost=await Post.findOneAndUpdate({_id:post},{$push: { likes: likedPost._id}},{new: true})
        .populate('likes')
        .exec();
        res
        .status(200)
        .json({
            success: true,
            message: 'Post Successfully Liked',
            response: addLikeToPost
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: `Internal Server Error ${error.message}`
        })
    }
}

exports.unlikePost=async(req,res)=>{
    try{
        const {postId}=req.params;
        const user=req.userId;
        const checkLike=await Like.findOne({post:postId,user});
        if(!checkLike){
            res
            .status(400) 
            .json({
                success: false,
                message: 'Post Already Unliked'
            })
        }
        const removeLike=await Like.deleteOne({_id: checkLike._id});
        const removeLikeFromPost=await Post.updateOne({_id:postId},{$pull: { likes: checkLike._id}},{new: true});
        res
        .status(200)
        .json({
            success: true,
            message: "post disliked",
            response: removeLikeFromPost
        })
    }
    catch(error){
        res
        .status(500)
        .json({
            success: false,
            message: `Internal Server Error ${error.message}`
        })
    }
}