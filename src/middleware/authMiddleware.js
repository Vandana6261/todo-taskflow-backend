import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
// import { generateAccessToken } from "../utils/token.js"; // not used



export const varifyToken = async (req, res, next) => {
  try {
    console.log("varifyToken called");
    const cookies = req.cookies;
    if (!cookies?.accessToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    const accessToken = cookies.accessToken;
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Token expired or invalid" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "User doesn't exist" });
        }
    
        req.userId = decoded.id;
        next();
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const handleReferesh = async (req, res) => {
  console.log("HandleRefresh called")
  const cookies = req.cookies;
  
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: "Refresh token missing. Please log in again." });
  }
  
  const refreshToken = cookies.refreshToken;
  console.log(refreshToken, "refreshToken")
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log(err, "err")
        return res.status(403).json({ message: "Forbidden (Expired or Invalid Refresh Token) Please Login" });
      }

      const accessToken = jwt.sign(
        {id: decoded.id},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
      )

      res.cookie("accessToken", accessToken, {...getCookieOptions, maxAge: 15 * 60 * 1000, });
      
      return res.status(200).json({ 
        message: "Access token refreshed successfully!" 
      });
    },
  );
};
