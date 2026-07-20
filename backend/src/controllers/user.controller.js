import { generateToken } from "../utils/tokens.js";
import {User} from "../models/user.model.js";
import { sendEmail } from "../utils/mail.js";
import crypto from "crypto";

const registerUser = async(req, res) => {
    try{
        const {username, email, password} = req.body;

        //basic validation
        if (!username?.trim() ||!email?.trim() ||!password?.trim()){
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        //user already exist
        const existing = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
        });
        if(existing){
            return res.status(409).json({
                message: existing.email === email.toLowerCase()
                    ? "User already exists"
                    : "Username already taken"
            });
        }

        //create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password
        });
        const accessToken = generateToken(user._id);
 
        res.status(201).json({
            message: "User registered succesfully",
            accessToken,
            user: {id: user._id, email: user.email, username: user.username}
        });
    }
    catch(error){
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ message: `${field} already in use` });
        }
        res.status(500).json({message: "Server error", error: error.message});
    }
};

const loginUser = async(req,res) => {
    try{

        //if user exist already
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        //user doesn't exist
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        //compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const accessToken = generateToken(user._id);

        res.status(200).json({
            message: "User logged in",
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    }
    catch(error){
        res.status(500).json({
            message: "Server error",  error: error.message
        });
    }
}
const logoutUser = async (req, res) => {
    return res.status(200).json({
        message: "Logged out successfully"
    });
};
const getProfile = async (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    });
};
const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email?.trim()){
            return res.status(400).json({message: "Please enter email"});
        }
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        //save hashed token to database
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset Request",
            `
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset it:</p>
            <a href="${resetURL}">Reset Password</a>
            <p>This link expires in 15 minutes.</p>
            `
        );
        return res.status(200).json({message: "Password reset link sent successfully."});
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error",error: error.message});
    }
};
const resetPassword = async(req,res) => {
    try{
        const { token } = req.params;
        const { password } = req.body;
        if(!password?.trim()){
            return res.status(400).json({message: "Password is required"});
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({passwordResetToken: hashedToken,passwordResetExpires: { $gt: Date.now() }});
        if(!user){
            return res.status(400).json({message: "Invalid or expired reset token"});
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return res.status(200).json({message: "Password reset successfully"});
    }
    catch(error){
        return res.status(500).json({message: "Server error", error: error.message});
    }
};
export{ 
    registerUser, loginUser, logoutUser, getProfile, forgotPassword, resetPassword
}
