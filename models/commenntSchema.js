const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
},{timestamps: true})

module.exports=mongoose.model('Comment',commentSchema);