const bcrypt = require("bcryptjs")
const {generateToken} = require("../utils/token")
const Todo = require("../models/todo");
const User = require("../models/user");
const Category = require("../models/category");

console.log("userService called")

const saveUserInfo = async(data) => {
    console.log("userService called")

    const {email, password} = data;
    let user = await User.findOne({email});
    
    if(user) {
        return {
            success: true,
            message: "User already exists",
            user
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({...data, password: hashedPassword})
    return {
        success: true,
        message: "User register successfully",
        user
    }

}

const register = async(email) => {
    const user = await User.findOne({email});
    console.log("register user called")
    if(!user) {
        return resjson({success: false, message: "User not found"})
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        user._id, 
        {$set: {isVarified: true}},
        {new: true}
    )
    return {success: true, message: "User registered successfully", user: updatedUser};
}
 

const getProfile = async(userId) => {
    const user = await User.findById(userId).select("-password");
    return user;
}

const login = async(data) => {
    console.log("login service")
    const {email, password} = data;
    const user = await User.findOne({email});
    
    if(!user) {
        return {
            success: false,
            message: "User don't exists"
        }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch) {
        return {
            success: false,
            message: "Password doesn't match"
        }
    }

    const token = generateToken(user._id);
    return {
        success: true,
        message: "Login Successfull",
        token, 
        user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
        }
    }
}


module.exports = {
    saveUserInfo,
    register, 
    getProfile,
    login
}