import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({success: false, message: "Unauthorized- No token provided"});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({success: false, message: "Unauthorized- Invalid token"});

        // Find user and attach to request
        User.findById(decoded.userId)
            .then(user => {
                if (!user) {
                    return res.status(401).json({success: false, message: "User not found"});
                }
                req.userId = decoded.userId;
                req.user = user; // Attach user to request object
                next();
            })
            .catch(err => {
                console.log("Error finding user: ", err);
                return res.status(500).json({success: false, message: "Server Error"});
            });
        
    } catch (error) {
        console.log("Error verifying token: ", error);
        return res.status(500).json({success: false, message: "Server Error"});
    }
}