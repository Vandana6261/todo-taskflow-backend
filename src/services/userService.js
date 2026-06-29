import bcrypt from 'bcryptjs';
// import {generateToken} from '../utils/token.js';
import Todo from '../models/todo.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import { AppError } from '../utils/AppError.js';

console.log("userService called")

const saveUserInfo = async(data) => {
    console.log("seveUserInfo service called")
    const {email, password} = data;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({...data, password: hashedPassword})
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
    const user = await User.findById(userId).select({
        password: 0,
        email: 0,
        _id: 0
    });
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
        throw new AppError("User not found", 404)
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


export {
  saveUserInfo,
  isUserExists,
  register,
  getProfile,
  login,
};