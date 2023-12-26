const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile_pic: {
        type: String
    },
    google_sign_in: {
        type: Boolean,
        default: false,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema);