import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        max: 20,
        trim: true
    },
    isVarified: {
        type: Boolean,
        default: false
    }
})


export default mongoose.model('User', userSchema);