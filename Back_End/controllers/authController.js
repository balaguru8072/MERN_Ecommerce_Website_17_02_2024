const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');
const mongoose = require('mongoose');


//http://localhost:8000/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password } = req.body

    let avatar;
    
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "developement"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res)
});



//http://localhost:8000/api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    // Find the user in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check if the entered password is correct
    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // If authentication is successful, send JWT token
    const token = sendToken(user, 201, res);
    res.status(200).json({ success: true, token });
});


//http://localhost:8000/api/v1/logout
exports.logoutUSer = (req, res, next) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "Logged Out"
    })
}


//http://localhost:8000/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });

    // 2. If user not found, return an error
    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // 3. Generate password reset token and save it to the user document
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 4. Create password reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    // 5. Create the message to be sent in the email
    const message = `Your password reset URL is as follows: \n\n${resetUrl}\n\n If you have not requested this email, then ignore it.`;

    try {
        // 6. Send the password reset email to the user
        await sendEmail({
            email: user.email,
            subject: 'BalaGuru Ecommerce Password Recovery',
            message
        });

        // 7. Respond with success message
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });
    } catch (error) {
        // 8. If an error occurs while sending the email, handle it
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }
});

//http://localhost:8080/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError( async (req, res, next) =>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token)  .digest('hex');

    const user  = await User.findOne({ 
        resetPasswordToken ,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler('password reset token is invalid or exprided'))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('password does not match password'))

    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({validateBeforeSave: false})

    sendToken(user, 201, res)
})

//Get User Profile http://localhost:8080/api/v1/myprofile
exports.getUserProfile = async (req, res, next) => {
    try {
        // Ensure that req.user is populated by the isAuthenticatedUser middleware
        if (!req.user) {
            return next(new ErrorHandler('User not authenticated', 401));
        }

        // Retrieve the user profile data
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // If user exists, send it in the response
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        // Handle any errors that occur during the process
        return next(new ErrorHandler('Something went wrong', 500));
    }
};

//change Password http://localhost:8000/api/v1/password/change

exports.changePassword = catchAsyncError (async (req, res, next) =>{
    const user = await User.findById(req.user.id).select('+password');



    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('old password is incorrect',401))
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    });

})

//Update Profile http://localhost:8000/api/v1/myprofile/update

exports.updateProfile = catchAsyncError (async (req, res, next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user =  await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,

    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Get All User http://localhost:8000/api/v1/admin/user

exports.getAllUsers = catchAsyncError (async (req, res, next) =>{ 
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//Admin: Get Specific User http://localhost:8000/api/v1/admin/user/:id

exports.getUser = catchAsyncError (async (req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
    
});

//Admin: Update User http://localhost:8000/api/v1/admin/user/:id

exports.updateUser = catchAsyncError (async (req, res, next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user =  await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,

    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Delete User http://localhost:8000/api/v1/admin/user/:id

exports.deleteUser = catchAsyncError (async (req, res, next) =>{
    try {
        const userId = req.params.id;

        // Ensure the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new ErrorHandler(`Invalid user ID: ${userId}`));
        }

        const deletedUser = await User.deleteOne({ _id: userId });

        // Check if the user was found and deleted
        if (deletedUser.deletedCount === 0) {
            return next(new ErrorHandler(`User not found with this id ${userId}`));
        }

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return next(error);
    }

})