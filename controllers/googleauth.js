const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.googleSignUp = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Please Send the Token'
                })
        }
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (response.status === 200) {
            const decodeToken = jwt.decode(token, false);
            let checkUser = await User.findOne({ email: decodeToken.email });
            if (!checkUser) {
                checkUser = await User.create({
                    email: decodeToken.email,
                    username: decodeToken.name,
                    profile_pic: decodeToken.picture,
                    google_sign_in: true,
                    active: true,
                    password: ' '
                })
            }
            checkUser=checkUser.toObject();
            checkUser.password=undefined;
            const accessToken=jwt.sign(checkUser,process.env.SECRET_KEY,{expiresIn: '24h'});
            checkUser.token=accessToken;
            res
            .status(200)
            .cookie('token',accessToken,{
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            })
            .json({
                success: true,
                message: 'User Successfully Logged In',
                response: checkUser
            })
            return;
        }
        res
        .status(400)
        .json({
            success: false,
            message: 'Invalid Token'
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