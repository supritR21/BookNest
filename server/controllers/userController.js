import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js"
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  console.log("Fetching all users");
  
  const users = await User.find({ accountVerified: true});
  console.log("Users fetched: ", users);
  
  res.status(200).json({
    success: true,
    users,
  });
})

export const registerNewadmin = catchAsyncErrors(async (req, res, next) => {
  if(!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload an image", 400));
  }

  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const isRegistered = await User.findOne({ email, accountVerified: true, role: "admin" });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }
  if(password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be 8 - 16 characters long", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
  if(!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "adminAvatars",
  });
  if(!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary upload error: ",
      cloudinaryResponse.error || "Unknown cloudinary error"
    )
    return next(new ErrorHandler("Failed to upload avatar image to cloudinary.", 500));
  }
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});