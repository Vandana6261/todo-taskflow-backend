const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    mobileNo: {
        type: Number,
        max: 10,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
})


module.exports = mongoose.model('User', userSchema)