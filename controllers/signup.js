const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

exports.signup = async (req, res) => {
    try {
        const userImage = req.files.img;
        console.log(userImage)
        const { email, password, username } = req.body;
        if(!userImage.name.includes('jpeg') && !userImage.name.includes('jpg') && !userImage.name.includes('png')){
            res
            .status(400)
            .json({
                success: false,
                message: 'Not Suported Image Formate'
            })
        }
        if (!email.includes('@') || !email.includes('.')) {
            res
                .status(422)
                .json({
                    success: false,
                    message: "Not a Valid email"
                })
        }
        // add nodemailer
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'User with same email exists'
                })
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (error) {
            res
                .status(500)
                .json({
                    success: false,
                    message: "error hashing data"
                })
        }
        const uploadImage = await cloudinary.uploader.upload(userImage.tempFilePath, {
            folder: 'bloggingapp'
        })
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            profile_pic: uploadImage.secure_url
        })
        res
        .status(200)
        .json({
            success: true,
            message: 'User Successfully created'
        })
    }
    catch (error) {
        res
        .status(501)
        .json({
            success: false,
            message:`Internal Server Error ${error.message}` 
        })
    }
}

