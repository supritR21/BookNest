import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
       console.log("Working...")
        if(!name || !email || !password) {
            return next(new ErrorHandler("Please enter all the fields.", 400));
        }

        const isRegistered = await User.findOne({email, accountVerified: true});
        if(isRegistered) {
            return next(new ErrorHandler("User already registered.", 400));
        }
        const registrationAttemptByUser = await User.find({
            email,
            accountVerified: false,
        });
        if(registrationAttemptByUser.length > 5) {
            return next(new ErrorHandler("You have exceeded the number of registration attempt  .", 400));
        }
        if(password.length < 8 || password.length > 15) {
            return next(new ErrorHandler("Password must be between 8 and 15 characters.", 400));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const verificationCode = user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);
    }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const {email, otp} = req.body;
    console.log(req.body);
    if(!email || !otp) {
        return next(new ErrorHandler("Email or OTP is missing.", 400));
    }
    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({createdAt: -1});

        if(userAllEntries === 0) {
            return next(new ErrorHandler("User not found.", 404));
        }

        let user;

        if(userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: {$ne: user._id},
                email,
                accountVerified: false,
            });
        } else {
            user = userAllEntries[0];
        }

        if(user.verificationCode.toString() !== otp.toString()) {
            return next(new ErrorHandler("Invalid OTP.", 400));
        }
        const currentTime = Date.now();

        const verificationCodeExpires = new Date(
            user.verificationCodeExpires
        ).getTime();

        if(currentTime > verificationCodeExpires) {
            return next(new ErrorHandler("OTP expired.", 400));
        }
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save({validateModifiedOnly: true});

        sendToken(user, 200, "Account Verified.", res);
    } catch(error) {
        return next(new ErrorHandler("Internal server error.", 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    console.log("Login Working");
    if(!email || !password) {
        return next(new ErrorHandler("Please enter all the fields.", 400));
    }
    try {
        const user = await User.findOne({email, accountVerified: true}).select("+password");
        if(!user) {
            return next(new ErrorHandler("Invalid email or password.", 401));
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password.", 401));
        }
        sendToken(user, 200, "Login successful.", res);
    } catch(error) {
        return next(new ErrorHandler("Internal server error.", 500));
    }
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully.",
    });
});