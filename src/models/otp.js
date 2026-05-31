const mongoose = require ("mongoose");


const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            trim: true
        },
        otp: {
            type: String,
            require: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        expiresAt: {
            type: Date,
            require: true
        },
    }, 
    {
        timeStamps: true
    }
)

module.exports = mongoose.model("Otp", otpSchema)