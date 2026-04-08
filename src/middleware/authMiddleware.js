const jwt = require('jsonwebtoken');

exports.varifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token)
        if(!token) {
            return res.status(401).json({message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.user = decoded.id;
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: "Invalid or expired token"})
    }
}