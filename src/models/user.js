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
    refreshHashed: {
        type: String,
        default: null
    },
    // mobileNo: {
    //     type: String,
    //     max: 20,
    //     trim: true
    // }
})


export default mongoose.model('User', userSchema);