import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../features/users/user.model.js";


export const authenticate = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized: Invalid token",
    });
  }
};


export const authorize = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: 'failed',
                message: "Forbidden: You don't have permission to access this resource"
            })
        }
        next()
    }
}