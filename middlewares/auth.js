const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        const { token } = req?.header('Authorization')?.replace('Bearer ', '') || req.cookies;
        
        if (!token) {
            res
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
        res
        .status(422)
        .json({
            success: false,
            message: `Invalid Token !! Please log In ${error.message}`
        })
    }
}