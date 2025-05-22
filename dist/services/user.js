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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// src/services/user.service.ts
const user_1 = require("../models/user");
const error_response_1 = require("../utils/error-response");
/**
 * User service - handles business logic for user operations
 */
class UserService {
    /**
     * Get user by ID
     * @param id User ID
     * @returns User document
     */
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findById(id);
            if (!user) {
                throw new error_response_1.ErrorResponse("User not found", 404);
            }
            return user;
        });
    }
    /**
     * Find user by email
     * @param email User email
     * @returns User document or null
     */
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.User.findOne({ email: email.toLowerCase() });
        });
    }
    /**
     * Find user by username
     * @param username Username
     * @returns User document or null
     */
    static findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.User.findOne({ username: username.toLowerCase() });
        });
    }
    /**
     * Find user by email or username
     * @param identifier Email or username
     * @returns User document or null
     */
    static findUserByEmailOrUsername(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.User.findOne({
                $or: [
                    { email: identifier.toLowerCase() },
                    { username: identifier.toLowerCase() },
                ],
            });
        });
    }
    /**
     * Create a new user
     * @param userData User data
     * @returns Created user
     */
    static createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.User.create(userData);
        });
    }
    /**
     * Update user profile
     * @param userId User ID
     * @param updateData Update data
     * @returns Updated user
     */
    static updateProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove sensitive fields if they exist
            const _a = updateData, { password } = _a, safeUpdateData = __rest(_a, ["password"]);
            return yield user_1.User.findByIdAndUpdate(userId, safeUpdateData, {
                new: true,
                runValidators: true,
            });
        });
    }
    /**
     * Update user password
     * @param user User document
     * @param newPassword New password
     * @returns Updated user
     */
    static updatePassword(user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = newPassword;
            yield user.save();
            return user;
        });
    }
    /**
     * Generate password reset token
     * @param email User email
     * @returns Reset token
     */
    static generatePasswordResetToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (!user) {
                throw new error_response_1.ErrorResponse("User not found", 404);
            }
            // Generate and hash token
            const resetToken = user.getResetPasswordToken();
            // Save token to user
            yield user.save({ validateBeforeSave: false });
            return resetToken;
        });
    }
    /**
     * Reset password
     * @param token Reset token
     * @param newPassword New password
     * @returns Updated user
     */
    static resetUserPassword(hashedToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by token
            const user = yield user_1.User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpire: { $gt: Date.now() },
            });
            if (!user) {
                throw new error_response_1.ErrorResponse("Invalid or expired token", 400);
            }
            // Set new password
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            yield user.save();
            return user;
        });
    }
}
exports.UserService = UserService;
