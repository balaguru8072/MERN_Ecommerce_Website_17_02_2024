const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.BALA_SECRET);
        req.user = await User.findById(decoded.id);
        req.user = decoded;
        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }
        console.log(req.user, "authenticated");
        next();
    } catch (err) {
        return next(new ErrorHandler('Invalid or expired token', 401));
    }
});

exports.authorizeRoles = (...roles) =>{
   return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
        }
        next()

    }
}