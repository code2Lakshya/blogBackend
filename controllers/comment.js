const Comment = require('../models/commenntSchema');
const Post = require('../models/postSchema');
const mongoose=require('mongoose');

exports.createComment = async (req, res) => {
    try {
        const { post, content } = req.body;
        const validatePost = await Post.findOne({ _id: post });
        const user = req.userId;
        if (!validatePost) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid Post'
                })
        }
        if (!content) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Content Required'
                })
        }
        const comment = await Comment.create({ user, post, content });
        const addToPost = await Post.updateOne({ _id: post }, { $push: { comments: comment._id } }, { new: true })
            .populate('comments')
            .exec();
            const findComment=await Comment.findOne({_id: comment._id}).populate('user').exec();
        res
            .status(200)
            .json({
                success: true,
                message: 'Comment Added',
                response: findComment
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Comment created'
            })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { comment } = req.query;
        const validateComment = await Comment.findOne({ _id: comment });
        if (!validateComment) {
           return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid Comment Id'
                })
        }
        if(!validateComment.user.equals(new mongoose.Types.ObjectId(req.userId))){
            return res
            .status(423)
            .json({
                success: false,
                message: 'You Are Not Permitted to Delete this comment'
            })
        }
        const deleteComment = await Comment.findOneAndDelete({ _id: validateComment._id });
        const deleteCommentFromPost=await Post.findOneAndUpdate(
            {_id: validateComment.post},
            {$pull: {comments: comment}});
        res
            .status(200)
            .json({
                success: true,
                response: deleteComment,
                message: 'Comment Successfully Deleted'
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: `Internal Server Error ${error}`
            })
    }
}

exports.editComment = async (req, res) => {
    try {
        const { comment, content } = req.body;
        const user = req.userId;
        if (!comment) {
            req
                .status(400)
                .json({
                    success: false,
                    message: 'Content invalid'
                })
        }
        const validateComment = await Comment.findOne({ _id: comment, user });
        if (!validateComment) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid Comment Id'
                })
        }
        const updatedComment = await Comment.findOneAndUpdate({ _id: comment }, { content }, { new: true });
        res
            .status(200)
            .json({
                success: true,
                message: 'Comment edited Successfully',
                response: updatedComment
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

exports.getAllComments = async (req, res) => {
    try {
        const { postId } = req.query;
        const findPost = await Post.findOne({ _id: postId });
        if (!findPost) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid PostId'
                })
        }
        const comments = await Comment.find({ _id: { $in: findPost.comments } }).populate('user').exec();
        return res
            .status(200)
            .json({
                success: true,
                message: 'Comments Found',
                response: comments
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