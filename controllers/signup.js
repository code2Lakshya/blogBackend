const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

exports.signup = async (req, res) => {
    try {
        const userImage = req?.files?.img;
        const { email, password, username } = req.body;
        let ressend = false;
        if (userImage
            && !userImage?.name?.includes('jpeg')
            && !userImage?.name?.includes('jpg')
            && !userImage?.name?.includes('png')
        ) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'Not Suported Image Formate'
                })
            ressend = true;
        }
        if ((!email.includes('@') || !email.includes('.')) && !ressend) {
            res
                .status(422)
                .json({
                    success: false,
                    message: "Not a Valid email"
                })
            ressend = true;
        }
        // add nodemailer
        const existingUser = await User.findOne({ email });
        if (existingUser && !ressend) {
            res
                .status(400)
                .json({
                    success: false,
                    message: 'User with same email exists'
                })
            ressend = true;
        }
        if (!ressend) {
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
            let uploadImage = null;
            if (userImage)
                uploadImage = await cloudinary.uploader.upload(userImage.tempFilePath, {
                    folder: 'bloggingapp'
                })
            const newUser = await User.create({
                email,
                password: hashedPassword,
                username,
                profile_pic: uploadImage ? uploadImage.secure_url : null
            })
            res
                .status(200)
                .json({
                    success: true,
                    message: 'User Successfully created'
                })
        }
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

