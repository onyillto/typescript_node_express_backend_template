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
exports.AuthService = void 0;
// src/services/auth.service.ts
const jwt_encode_1 = __importDefault(require("jwt-encode"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("./user");
const error_response_1 = require("../utils/error-response");
const env_1 = __importDefault(require("../config/env"));
/**
 * Authentication service - handles business logic for authentication
 */
class AuthService {
    /**
     * Register a new user
     * @param userData User registration data
     * @returns Registered user and token
     */
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, }) {
            // Check if user already exists
            yield this.checkUserExists(email, username);
            // Create user
            const user = yield user_1.UserService.createUser({
                username,
                email,
                password,
            });
            // Generate token
            const token = this.generateToken(user);
            return { user, token };
        });
    }
    /**
     * Login user
     * @param identifier Username or email
     * @param password Password
     * @returns Logged in user and token
     */
    static login(identifier, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!identifier || !password) {
                throw new error_response_1.ErrorResponse("Please provide email/username and password", 400);
            }
            // Find user
            const user = yield user_1.UserService.findUserByEmailOrUsername(identifier);
            if (!user) {
                throw new error_response_1.ErrorResponse("Invalid credentials", 401);
            }
            // Check password
            const isPasswordMatch = yield user.comparePassword(password);
            if (!isPasswordMatch) {
                throw new error_response_1.ErrorResponse("Invalid credentials", 401);
            }
            // Generate token
            const token = this.generateToken(user);
            return { user, token };
        });
    }
    /**
     * Generate JWT token using jwt-encode
     * @param user User document
     * @returns JWT token
     */
    static generateToken(user) {
        if (!user._id) {
            throw new error_response_1.ErrorResponse("User ID is required for token generation", 500);
        }
        try {
            // Calculate expiry time based on env.JWT_EXPIRE
            const expirySeconds = this.getExpiryInSeconds(this.TOKEN_EXPIRY);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiryTime = currentTime + expirySeconds;
            // Create payload with expiration time
            const payload = {
                id: user._id.toString(),
                iat: currentTime,
                exp: expiryTime,
                username: user.username,
                role: user.role || "user",
            };
            // Create options for jwt-encode
            const options = {
                alg: "HS256",
                typ: "JWT",
            };
            // Sign the token
            return (0, jwt_encode_1.default)(payload, env_1.default.JWT_SECRET, options);
        }
        catch (error) {
            console.error("Token generation error:", error);
            throw new error_response_1.ErrorResponse(`Failed to generate token: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
        }
    }
    /**
     * Generate authentication token with expiry
     * @param user User document
     * @returns Token and expiration date
     */
    static generateAuthToken(user) {
        if (!user._id) {
            throw new error_response_1.ErrorResponse("User ID is required to generate token", 500);
        }
        try {
            // Calculate expiry time
            const expirySeconds = this.getExpiryInSeconds(this.TOKEN_EXPIRY);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiryTime = currentTime + expirySeconds;
            const expiresAt = new Date(expiryTime * 1000);
            // Create payload with expiration time
            const payload = {
                id: user._id.toString(),
                iat: currentTime,
                exp: expiryTime,
                username: user.username,
                email: user.email,
                role: user.role || "user",
            };
            // Create options for jwt-encode
            const options = {
                alg: "HS256",
                typ: "JWT",
            };
            // Sign the token
            const token = (0, jwt_encode_1.default)(payload, env_1.default.JWT_SECRET, options);
            return { token, expiresAt };
        }
        catch (error) {
            console.error("Token generation error:", error);
            throw new error_response_1.ErrorResponse("Failed to generate authentication token. Please try again later.", 500);
        }
    }
    /**
     * Send password reset email
     * @param email User email
     * @returns Reset token
     */
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new error_response_1.ErrorResponse("Email is required", 400);
            }
            // Generate token
            const resetToken = yield user_1.UserService.generatePasswordResetToken(email);
            return resetToken;
        });
    }
    /**
     * Reset user password
     * @param resetToken Raw reset token
     * @param newPassword New password
     * @returns Updated user and token
     */
    static resetPassword(resetToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resetToken || !newPassword) {
                throw new error_response_1.ErrorResponse("Reset token and new password are required", 400);
            }
            // Hash token
            const hashedToken = this.hashString(resetToken);
            // Reset password
            const user = yield user_1.UserService.resetUserPassword(hashedToken, newPassword);
            // Generate token
            const token = this.generateToken(user);
            return { user, token };
        });
    }
    /**
     * Verify OTP (one-time password)
     * @param email User email
     * @param otp OTP
     * @returns True if OTP is valid
     */
    static verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !otp) {
                return false;
            }
            // Hash OTP
            const hashedOTP = this.hashString(otp);
            // Find user with OTP
            const user = yield user_1.UserService.findUserByEmail(email);
            if (!user || !user.resetPasswordToken || !user.resetPasswordExpire) {
                return false;
            }
            // Check if OTP matches and is not expired
            const isValid = user.resetPasswordToken === hashedOTP &&
                user.resetPasswordExpire.getTime() > Date.now();
            return isValid;
        });
    }
    // -------------------- Private Utility Methods --------------------
    /**
     * Hash a string using SHA-256
     * @param str String to hash
     * @returns Hashed string
     */
    static hashString(str) {
        return crypto_1.default
            .createHash(this.HASH_ALGORITHM)
            .update(str)
            .digest(this.ENCODING);
    }
    /**
     * Check if a user exists with the given email or username
     * @param email Email
     * @param username Username
     * @throws ErrorResponse if user exists
     */
    static checkUserExists(email, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = (yield user_1.UserService.findUserByEmailOrUsername(email)) ||
                (yield user_1.UserService.findUserByEmailOrUsername(username));
            if (existingUser) {
                throw new error_response_1.ErrorResponse("User already exists", 400);
            }
        });
    }
    /**
     * Convert expiry string to seconds
     * @param expiry Expiry string (e.g. '30d', '1h', '30m')
     * @returns Expiry in seconds
     */
    static getExpiryInSeconds(expiry) {
        // Default to 30 days if not specified
        if (!expiry)
            return 30 * 24 * 60 * 60;
        // Parse the expiry string
        const unit = expiry.charAt(expiry.length - 1);
        const value = parseInt(expiry.substring(0, expiry.length - 1), 10);
        switch (unit) {
            case "s":
                return value;
            case "m":
                return value * 60;
            case "h":
                return value * 60 * 60;
            case "d":
                return value * 24 * 60 * 60;
            default:
                // If no unit is specified, assume seconds
                return parseInt(expiry, 10);
        }
    }
}
exports.AuthService = AuthService;
// Constants for better maintainability
AuthService.TOKEN_EXPIRY = env_1.default.JWT_EXPIRE || "30d";
AuthService.HASH_ALGORITHM = "sha256";
AuthService.ENCODING = "hex";
