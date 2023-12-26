const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.includes('@') || !email.includes('.')) {
            res
                .status(422)
                .json({
                    success: false,
                    message: "Invalid Email Id"
                })
            return;
        }
        let existingUser = await User.findOne({ email });
        if (!existingUser ) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'User Dosent exist with email'
                })
                return;
        }
        const checkGoogleUser=await User.findOne({email});
        if(checkGoogleUser.google_sign_in){
            res
            .status(400)
            .json({
                success: false,
                message: 'Use Google Sign In'
            })
        }
        let checkPassword;
        try {
            checkPassword = await bcrypt.compare(password, existingUser.password);
        }
        catch (error) {
            res
                .status(500)
                .json({
                    success: false,
                    message: "Error Hashing Password"
                })
            return;
        }
        if (!checkPassword) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Wrong Password"
                })
            return;
        }
        existingUser = existingUser.toObject();
        existingUser.password = undefined;
        const token = jwt.sign(existingUser, process.env.SECRET_KEY, {
            expiresIn: '24h'
        });
        existingUser.token = token;
        res
            .status(200)
            .cookie('token', token, {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            })
            .json({
                success: true,
                message: 'User Successfully logged In',
                response: existingUser
            })
    }
    catch (error) {
        res
            .status(501)
            .json({
                success: false,
                message: `Internal Server Error ${error.message}`
            })
    }
}