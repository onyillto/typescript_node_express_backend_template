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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_1 = require("../models/user");
const error_response_1 = require("../utils/error-response");
const auth_1 = require("../services/auth");
// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token using AuthService (recommended approach)
    const token = auth_1.AuthService.generateToken(user);
    res.status(statusCode).json({
        success: true,
        message: "Login successful", // ✅ Add your custom message here
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
};
// @desc   Register use
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
        // Handle duplicate key error (user already exists)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const message = `${field} already exists`;
            return next(new error_response_1.ErrorResponse(message, 400));
        }
        next(error);
    }
});
exports.register = register;
