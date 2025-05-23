"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_response_1 = require("../utils/error-response");
const env_1 = __importDefault(require("../config/env"));
class AuthService {
    /**
     * Generate JWT token
     * @param user User document
     * @returns JWT token as string
     */
    static generateToken(user) {
        if (!user._id) {
            throw new error_response_1.ErrorResponse("User ID is required for token generation", 500);
        }
        const payload = {
            id: user._id.toString(),
            username: user.username,
            role: user.role || "user",
        };
        if (!env_1.default.JWT_SECRET || env_1.default.JWT_SECRET === "your_jwt_secret") {
            throw new error_response_1.ErrorResponse("JWT_SECRET is not properly configured in environment variables", 500);
        }
        // Define token options separately and ensure correct types
        const options = {
            expiresIn: AuthService.getExpiryInSeconds(AuthService.TOKEN_EXPIRY),
        };
        try {
            return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_SECRET, options);
        }
        catch (error) {
            console.error("Token generation error:", error);
            throw new error_response_1.ErrorResponse(`Failed to generate token: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
        }
    }
    /**
     * Convert expiry string to seconds (not used, but can be useful)
     */
    static getExpiryInSeconds(expiry) {
        if (!expiry)
            return 30 * 24 * 60 * 60;
        const unit = expiry.slice(-1);
        const value = parseInt(expiry.slice(0, -1), 10);
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
                return parseInt(expiry, 10);
        }
    }
}
exports.AuthService = AuthService;
AuthService.TOKEN_EXPIRY = env_1.default.JWT_EXPIRE || "30d";
