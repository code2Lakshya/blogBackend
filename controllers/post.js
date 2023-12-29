const Post = require('../models/postSchema');
const cloudinary = require('cloudinary').v2;
const Comment = require('../models/commenntSchema');
const Like = require('../models/likeSchema');
const Category = require('../models/categorySchema');


exports.createPost = async (req, res) => {
    try {
        const { title, content, categories, newCategory } = req.body;
        const postImg = req?.files?.img;
        const userId = req.userId;
        let resSend = false;
        if (!title || !content) {
            res
                .status(406)
                .json({
                    success: false,
                    message: 'Missing content or title'
                })
            resSend = true;
        }
        if (categories?.length + newCategory?.length > 5 || categories?.length > 5 || newCategory?.length > 5) {
            console.log(categories?.length + newCategory?.length, categories?.length, newCategory?.length,);
            res
                .status(500)
                .json({
                    success: false,
                    message: "Only upto 5 categories allowed"
                })
            resSend = true;
        }
        let uploadImage;
        if (postImg) {
            uploadImage = await cloudinary.uploader.upload(postImg.tempFilePath, {
                folder: 'bloggingapp'
            })
        }
        let newItem = [];
        if (newCategory) {
            for (let item of newCategory) {
                const checkItem = await Category.findOne({ category: item.toLowerCase() });
                if (checkItem && !resSend) {
                    res
                        .status(400)
                        .json({
                            success: false,
                            message: 'Category Already Exists'
                        })
                    resSend = true;
                }
                const createdItem = await Category.create({ category: item.toLowerCase() });
                newItem.push(createdItem._id);
            }
        }
        if (!resSend) {
            let newPost;
            if (uploadImage) {
                newPost = await Post.create({
                    title,
                    content,
                    user: userId,
                    img_url: uploadImage.secure_url,
                    public_id: uploadImage.public_id
                })
            }
            else {
                newPost = await Post.create({
                    title,
                    content,
                    user: userId
                })
            }
            if (categories) {
                for (let item of categories) {
                    const checkCategory = await Category.findOneAndUpdate({ _id: item }, { $push: { posts: newPost._id } }, { new: true });
                    const addToPost = await Post.updateOne({ _id: newPost._id }, { $push: { categories: checkCategory._id } });
                }
            }
            if (newItem.length > 0) {
                for (let item of newItem) {
                    const checkCategory = await Category.findOneAndUpdate({ _id: item }, { $push: { posts: newPost._id } }, { new: true });
                    const addToPost = await Post.updateOne({ _id: newPost._id }, { $push: { categories: checkCategory._id } }, { new: true });
                }
            }
            newPost = await Post.findOne({ _id: newPost._id }).populate('categories').exec();
            if (!resSend)
                res
                    .status(200)
                    .json({
                        success: true,
                        message: 'Post Created',
                        response: newPost
                    })
        }
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
        checkPost.categories.forEach(async (item) => {
            const deleteCategory = await Category.updateOne({ _id: item }, { $pull: { posts: post } });
        })
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

exports.getAllPost = async (req, res) => {
    try {
        const allPost = await Post.find({}).populate('user').populate('categories').exec();
        res
            .status(200)
            .json({
                success: true,
                message: 'All Posts Sent',
                response: allPost
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal Server Error'
            })
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId }).populate('user');
        res
            .status(200)
            .json({
                success: true,
                message: 'All Posts Send',
                response: posts
            })
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal Server Error'
            })
    }
}

exports.getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId })
            .populate('user')
            .populate('likes')
            .populate('comments')
            .populate('categories')
            .exec();
        if (!post) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid Post Id'
                })
        }
        const categories = post.categories.map(item => item._id);
        const similar_posts = await Post.find({
            categories: { $in: categories },
            title: { $ne: post.title }
        }).limit(3).exec();
        res
            .status(200)
            .json({
                success: true,
                message: 'Post Found',
                response: { post, similar_posts }
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

exports.getRandomPost = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('likes')
            .populate('comments')
            .populate('categories')
            .populate('user')
            .exec();
        const randomPost = posts[Math.floor((posts.length - 1) * Math.random())];
        res
            .status(200)
            .json({
                success: true,
                response: randomPost,
                message: 'Random Post Sent'
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

exports.getPaginatedPost = async (req, res) => {
    try {
        let { page, limit, skip } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 10;
        const totalPosts = await Post.countDocuments({});
        if ((page - 1) * limit >= totalPosts) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'You Have Reached The End'
                })
        }
        else {
            const posts = await Post.find({})
                .skip(((page - 1) * limit) + (skip ? Number(skip) : 0))
                .limit(limit)
                .populate('user')
                .populate('categories')
                .exec();
            res
                .status(200)
                .json({
                    success: true,
                    response: {
                        page,
                        limit,
                        totalPage: Math.ceil((totalPosts - (skip ? skip : 0)) / Number(limit)),
                        posts
                    }
                })
        }
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal Server Error'
            })
    }
}