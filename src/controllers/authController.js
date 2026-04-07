const User = require('../models/user')
const bcrypt = require("bcryptjs");
const {generateToken} = require("../utils/token");
const userService  = require('../services/userService') 


exports.register = async (req, res) => {
    try {
        console.log("register")
        const response = await userService.register(req.body)
        // console.log(user)
        if(!response.success) {
            return res.status(400).json({message: response.message})
        }
        return res.status(201).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
}


exports.login = async (req, res) => {
    try {
        console.log("login")
        const response = await userService.login(req.body);
        if(!response.success) {
            console.log(response)
            res.status(400).json({message: response.message});
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// Protected Router Example
exports.getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user.id)
        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}