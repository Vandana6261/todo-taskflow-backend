const User = require('../models/user')
const bcrypt = require("bcryptjs")
const {generateToken} = require("../utils/token")

const register = async(data) => {
    console.log("userService called")
    console.log(data);

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
    return await User.find({user: userId}).select("-password");
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






// exports.register = async (req, res) => {
//     try {
//         console.log("register")
//         const response = await userService.register(req.body)
//         return res.status(201).json(response);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message: error.message})
//     }
    
// }
