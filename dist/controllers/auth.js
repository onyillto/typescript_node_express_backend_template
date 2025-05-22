"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.updateDetails = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../models/user");
const email_1 = require("../services/email");
const error_response_1 = require("../utils/error-response");
const logger_1 = __importDefault(require("../utils/logger"));
// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Create user
        const user = yield user_1.User.create({
            username,
            email,
            password,
        });
        // Send token response
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Validate credentials
        if (!username || !password) {
            return next(new error_response_1.ErrorResponse("Please provide username/email and password", 400));
        }
        // Check if user exists
        const user = yield user_1.User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: username.toLowerCase() },
            ],
        }).select("+password");
        if (!user) {
            return next(new error_response_1.ErrorResponse("Invalid credentials", 401));
        }
        // Check if password matches
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return next(new error_response_1.ErrorResponse("Invalid credentials", 401));
        }
        // Send token response
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// @desc   Log user out / clear cookie
// @route  GET /api/v1/auth/logout
// @access Private
const logout = (req, res) => {
    res.status(200).json({
        success: true,
        data: {},
    });
};
exports.logout = logout;
// @desc   Get current logged in user
// @route  GET /api/v1/auth/me
// @access Private
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new error_response_1.ErrorResponse("Not authorized", 401));
    }
    // Ensure req.user is properly typed and includes an id property
    const user = yield user_1.User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
});
exports.getMe = getMe;
// @desc   Update user details
// @route  PUT /api/v1/auth/updatedetails
// @access Private
const updateDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only allow updating specific fields
        const fieldsToUpdate = {
            fullName: req.body.fullName,
            email: req.body.email,
            about: req.body.about,
            role: req.body.role,
            experience: req.body.experience,
            skills: req.body.skills,
        };
        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);
        if (!req.user) {
            return next(new error_response_1.ErrorResponse("Not authorized", 401));
        }
        const user = yield user_1.User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateDetails = updateDetails;
// @desc   Update password
// @route  PUT /api/v1/auth/updatepassword
// @access Private
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        // Get user with password
        if (!req.user) {
            return next(new error_response_1.ErrorResponse("Not authorized", 401));
        }
        const user = yield user_1.User.findById(req.user.id).select("+password");
        if (!user) {
            return next(new error_response_1.ErrorResponse("User not found", 404));
        }
        // Check current password
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return next(new error_response_1.ErrorResponse("Password is incorrect", 401));
        }
        // Set new password
        user.password = newPassword;
        yield user.save();
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.updatePassword = updatePassword;
// @desc   Forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access Public
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return next(new error_response_1.ErrorResponse("There is no user with that email", 404));
        }
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        // Save user with the reset token and expiry
        yield user.save({ validateBeforeSave: false });
        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit: \n\n ${resetUrl}`;
        try {
            yield (0, email_1.sendEmail)({
                email: user.email,
                subject: "Password Reset Token",
                message,
            });
            res.status(200).json({
                success: true,
                data: "Email sent",
            });
        }
        catch (err) {
            logger_1.default.error(`Email could not be sent: ${err}`);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            yield user.save({ validateBeforeSave: false });
            return next(new error_response_1.ErrorResponse("Email could not be sent", 500));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
// @desc   Reset password
// @route  PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get hashed token
        const resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(req.params.resettoken)
            .digest("hex");
        const user = yield user_1.User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return next(new error_response_1.ErrorResponse("Invalid or expired token", 400));
        }
        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
// @desc   Verify OTP for password reset
// @route  POST /api/v1/auth/verifyotp
// @access Public
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find user with the given email
        const user = yield user_1.User.findOne({
            email,
            resetPasswordToken: crypto_1.default.createHash("sha256").update(otp).digest("hex"),
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return next(new error_response_1.ErrorResponse("Invalid or expired OTP", 400));
        }
        res.status(200).json({
            success: true,
            data: {
                message: "OTP verified successfully",
                token: otp, // Return the original OTP as the token for the reset password step
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
    const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, {
        expiresIn: "30d",
    });
    // Remove password from response
    user.password = undefined;
    res.status(statusCode).json({
        success: true,
        token,
        data: user,
    });
};
function next(arg0) {
    throw new Error("Function not implemented.");
}
