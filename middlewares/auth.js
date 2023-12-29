const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        const  token  = req.cookies.token ||req?.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
           return res
                .status(423)
                .json({
                    success: false,
                    message: "Missing Token"
                })
        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        req.userId=verifyToken._id;
        next();
    }
    catch (error) {
       return res
        .status(422)
        .json({
            success: false,
            message: `Invalid Token !! Please log In ${error.message}`
        })
    }
}