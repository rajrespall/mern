import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
// import admin from "../utils/firebase.js";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import { sendVerificationEmail, SendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";

export const signup= async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }   
        const userAlreadyExists = await User.findOne({email});
        if (userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email, 
            password: hashedPassword, 
            name,  
            verificationToken: verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })
        await user.save();

        const [firstName, lastName] = name.split(' ');
        const profile = new Profile({
            user: user._id,
            firstName: firstName || name,
            lastName: lastName || '',
            contactNo: '',
            address: ''
        });
        await profile.save();

        generateTokenandSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true, 
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
    });
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}
export const verifyEmail = async (req, res) => {
   const {code} = req.body;
   try {
        const user = await User.findOne({
            verificationToken: code, 
            verificationTokenExpires: {$gt: Date.now()}});

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        await SendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true, 
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
   } catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({success: false, message: "Server error"});
   }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        } 
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        
        generateTokenandSetCookie(res, user._id);   
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true, 
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("error in login", error);
        res.status(400).json({success: false, message: error.message});
    }
};
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully"});
}
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success: true, message: "Password reset link sent to your email"});
    } catch (error) {
        console.log("error in forgotPassword", error);
        res.status(400).json({success: false, message: error.message});   
    }
}
export const resetPassword = async (req, res) => {
    
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired reset token"});
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successfully"});

    } catch (error) {
        console.log("error in resetPassword", error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;
        const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.json({token, email});
    }catch(error) {
        console.log("error in googleLogin", error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const checkAuth = async (req, res) => { 
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }

        res.status(200).json({
            success: true, 
            user
        });
    } catch (error) {
        
    }
}
