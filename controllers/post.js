const Post = require('../models/postSchema');
const cloudinary = require('cloudinary').v2;
const Comment = require('../models/commenntSchema');
const Like = require('../models/likeSchema');


exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const postImg = req.files.img;
        const userId = req.userId;
        if (!title || !content) {
            res
                .status(406)
                .json({
                    success: false,
                    message: 'Missing content or title'
                })
        }
        console.log(postImg);
        let uploadImage;
        if (postImg) {
            uploadImage = await cloudinary.uploader.upload(postImg.tempFilePath, {
                folder: 'bloggingapp'
            })
        }
        console.log(uploadImage);
        const post = await Post.create(uploadImage ?
            { title, content, user: userId, img_url: uploadImage.secure_url , public_id: uploadImage.public_id} :
            { title, content, user: userId });
        res
            .status(200)
            .json({
                success: true,
                message: 'Post Created',
                response: post
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: `Internal Server Error ${error.message}`
            })
    }
}


exports.deletePost = async (req, res) => {
    try {
        const { post } = req.params;
        if (!post) {
            req
                .status(400)
                .json({
                    success: false,
                    message: 'Missing Post Id'
                })
        }
        const checkPost = await Post.findOne({ _id: post });
        if (!checkPost) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Post Not Found'
                })
        }
        const deletePost = await Post.deleteOne({ _id: post });
        if (checkPost.img_url) {
            try {
                const publicIdToDelete = cloudinary.uploader.destroy(checkPost.public_id)
            }
            catch (error) {
                console.log(error);
            }
        }
        const deleteComments = await Comment.deleteMany({ post });
        const deleteLikes = await Like.deleteMany({ post });

        res
            .status(200)
            .json({
                success: true,
                response: deletePost,
                message: 'Post Successfully Deleted'
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: `Internal Server Error ${error.message}`
            })
    }
}

exports.getAllPost=async(req,res)=>{
    try{
        const allPost=await Post.find({}).populate('user').exec();
        res
        .status(200)
        .json({
            success: true,
            message: 'All Posts Send',
            response: allPost
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

exports.getUserPosts=async(req,res)=>{
    try{
        const {userId}=req.params;
        const posts=await Post.find({user:userId}).populate('user');
        res
        .status(200)
        .json({
            success: true,
            message: 'All Posts Send',
            response: posts
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

exports.getPost=async(req,res)=>{
    try{
        const {postId}=req.params;
        const post=await Post.findOne({_id: postId}).populate('user').populate('likes').populate('comments').exec();
        res
        .status(200)
        .json({
            success: true,
            message: 'Post Found',
            response: post
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

