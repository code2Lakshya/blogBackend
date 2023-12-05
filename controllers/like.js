const Like=require('../models/likeSchema');
const Post=require('../models/postSchema');

exports.likePost=async(req,res)=>{
    try{
        const {post,user}=req.body;
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
        const {post,user}=req.body;
        const checkLike=await Like.findOne({_id:user});
        if(!checkLike){
            res
            .status(400)
            .json({
                success: false,
                message: 'Post Already Unliked'
            })
        }
        const removeLike=await Like.deleteOne({_id:user});
        const removeLikeFromPost=await Post.updateOne({_id:post},{$pull: { likes: checkLike._id}},{new: true});
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