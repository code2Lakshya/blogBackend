const Category = require('../models/categorySchema');

exports.getAllCategories = async (req, res) => {
    try {
        const category = await Category.find({});
        res
            .status(200)
            .json({
                success: true,
                response: category,
                message: 'All Category sent'
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

exports.singleCategoryPosts = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const ressend = false;
        if (!categoryId) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Missing Category"
                })
            ressend = true;
        }
        const findCategory = await Category.findOne({ _id: categoryId }).populate('posts').exec();
        if (!findCategory && !ressend) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid Category Id'
                })
            ressend = true;
        }
        !ressend &&
            res
                .status(200)
                .json({
                    success: true,
                    message: 'Category found',
                    response: findCategory
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