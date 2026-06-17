const bcrypt = require("bcryptjs")
const {generateToken} = require("../utils/token")
const Todo = require("../models/todo");
const User = require("../models/user");
const Category = require("../models/category");

console.log("userService called")

const saveUserInfo = async(data) => {
    console.log("seveUserInfo service called")
    const {email, password} = data;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({...data, password: hashedPassword})
    return user;
}

const isUserExists = async(email) => {
    return await User.findOne({email});
}

const register = async(userId) => {
    console.log("register user called")
    const user = await User.findOne({_id: userId});
    if(!user) {
        return {success: false, message: "User not found"}
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        {$set: {isVarified: true}},
        {new: true}
    )
    return {success: true, message: "User registered successfully", user: updatedUser}
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
    
    return {
        success: true,
        message: "Login Successfull",
        user: {
            name: `${user.firstName} ${user.lastName}`,
            id: user._id,
        }
    }
}


module.exports = {
    saveUserInfo,
    isUserExists,
    register,
    getProfile,
    login
}