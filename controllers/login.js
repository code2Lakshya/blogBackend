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
        }
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'User Dosent exist with email'
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
        }
        existingUser = existingUser.toObject();
        existingUser.password = undefined;
        const token = jwt.sign(existingUser, process.env.SECRET_KEY, {
            expiresIn: '24h'
        });
        res
            .status(400)
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