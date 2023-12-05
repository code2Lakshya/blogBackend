const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true
    },
    profile_pic:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        default: false
    }
})

module.exports=mongoose.model('User',userSchema);