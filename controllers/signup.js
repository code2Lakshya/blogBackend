const User=require('../models/userSchema');
const bcrypt=require('bcrypt');

exports.signup=async(req,res)=>{
    try{
        const userImage=req.files.file;
        const {email,password,username}=req.body;
        if(!email.includes('@')){
            res
            .status(422)
            .json({
                success: false,
                message: "Not a Valid email"
            })
        }
        
    }
    catch(error){

    }
}