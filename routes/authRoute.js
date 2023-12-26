const express=require('express');
const router=express.Router();

const {signup}=require('../controllers/signup');
const {login}=require('../controllers/login');
const {googleSignUp}=require('../controllers/googleauth');

router.post('/signup',signup);
router.post('/login',login);
router.get('/googlesignin',googleSignUp);

module.exports=router;