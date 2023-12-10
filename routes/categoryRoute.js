const express=require('express');
const router=express.Router();

const {getAllCategories,singleCategoryPosts}=require('../controllers/category');

router.get('/categories',getAllCategories);
router.get('/category/:categoryId',singleCategoryPosts);

module.exports=router;