import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // console.log("Checking authentication...");
  
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  
  req.user = await User.findById(decoded.id);
  
  next();
});

export const isAuthorized = (...roles) => {  
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // console.log("not allowed");
      // return next(new ErrorHandler(`User with role ${req.user.role} is not allowed to access this resource.`, 403));
      return res.status(403).json({
        success: false,
        message: `User with role ${req.user.role} is not allowed to access this resource.`,
      });
    }
    console.log("Authorized");
    
    next();
  };
};