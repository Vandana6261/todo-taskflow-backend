const bcrypt = require("bcryptjs")
const {generateToken} = require("../utils/token")
const Todo = require("../models/todo");
const User = require("../models/user");
const Category = require("../models/category");

console.log("userService called")

const register = async(data) => {
    console.log("userService called")

    const {email, password} = data;
    const isUserExists = await User.findOne({email});
    if(isUserExists) {
        return {
            success: false,
            message: "User already exists"
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({...data, password: hashedPassword})
    return {
        success: true,
        message: "User register successfully",
        user
    }

}

const getProfile = async(userId) => {
    const user = await User.findById(userId).select("-password");
    const todo = await Todo.find({ user: user._id });
    const category = await Category.find( {user: user._id });
    console.log("user", user);
    console.log("todo", todo);
    console.log("category", category);
    return {
        user,
        todo,
        category
    }
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
    register, 
    getProfile,
    login
}