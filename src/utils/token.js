const jwt = require("jsonwebtoken");
console.log("Token generate called")

exports.generateAccessToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

exports.generateRefreshToken = (userId) => {
    return jwt.sign(
        {id: userId}, 
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}