"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.profileValidationRules = exports.authValidationRules = exports.userValidationRules = void 0;
const expressValidator = __importStar(require("express-validator"));
const { body, param } = expressValidator;
/**
 * Common validation rules that can be reused across routes
 */
// User validation
exports.userValidationRules = {
    // Username validation
    username: () => body("username")
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
    // Email validation
    email: () => body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    // Password validation
    password: () => body("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    // Full name validation
    fullName: () => body("fullName")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),
};
// Authentication validation
exports.authValidationRules = {
    // Login validation
    login: () => [
        body("username")
            .notEmpty()
            .withMessage("Please provide a username or email"),
        body("password").notEmpty().withMessage("Please provide a password"),
    ],
    // Register validation
    register: () => [
        exports.userValidationRules.username(),
        exports.userValidationRules.email(),
        exports.userValidationRules.password(),
    ],
    // Reset password validation
    resetPassword: () => [
        exports.userValidationRules.password(),
        body("confirmPassword")
            .isString()
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
        param("resettoken")
            .isString()
            .isLength({ min: 32, max: 64 })
            .withMessage("Invalid reset token"),
    ],
};
// Profile validation
exports.profileValidationRules = {
    // Onboarding step 1 validation
    onboardingStep1: () => [
        exports.userValidationRules.fullName(),
        body("role")
            .isIn(["user", "specialist", "admin"])
            .withMessage("Role must be either user, specialist, or admin"),
        body("experience")
            .isIn(["0-5", "5-10", "10+"])
            .withMessage("Experience must be either 0-5, 5-10, or 10+"),
        body("about")
            .isString()
            .trim()
            .isLength({ max: 500 })
            .withMessage("About must not exceed 500 characters"),
    ],
    // Onboarding step 2 validation
    onboardingStep2: () => [
        body("skills").isObject().withMessage("Skills must be an object"),
        body("skills.fashion").isBoolean().withMessage("Fashion must be a boolean"),
        body("skills.graphicDesigner")
            .isBoolean()
            .withMessage("Graphic designer must be a boolean"),
        body("skills.videoEditor")
            .isBoolean()
            .withMessage("Video editor must be a boolean"),
        body("skills.contentCreator")
            .isBoolean()
            .withMessage("Content creator must be a boolean"),
        body("skills.photographer")
            .isBoolean()
            .withMessage("Photographer must be a boolean"),
        body("skills.writer").isBoolean().withMessage("Writer must be a boolean"),
        body("skills.others").isBoolean().withMessage("Others must be a boolean"),
    ],
};
// Helper function to validate ObjectId
const validateObjectId = (paramName) => {
    return param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`);
};
exports.validateObjectId = validateObjectId;
