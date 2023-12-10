const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    category:{
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

module.exports=mongoose.model('Category',categorySchema);