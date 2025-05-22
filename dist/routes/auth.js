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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = __importDefault(require("express"));
const expressValidator = __importStar(require("express-validator"));
const { body } = expressValidator;
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
// Register validation
const registerValidation = [
    body("username")
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];
// Login validation
const loginValidation = [
    body("username").isLength({ min: 1 }).withMessage("Please provide a username or email"),
    body("password").notEmpty().withMessage("Please provide a password"),
];
// Update details validation
const updateDetailsValidation = [
    body("fullName").if(body("fullName").exists()).isString().trim(),
    body("email")
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
];
// Update password validation
const updatePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Please provide current password"),
    body("newPassword")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];
// Forgot password validation
const forgotPasswordValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
];
// Reset password validation
const resetPasswordValidation = [
    body("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];
// Verify OTP validation
const verifyOTPValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("otp")
        .isString()
        .isLength({ min: 4, max: 6 })
        .withMessage("Please provide a valid OTP"),
];
// Public routes
router.post("/register", (0, validation_1.validate)(registerValidation), auth_1.register);
router.post("/login", (0, validation_1.validate)(loginValidation), auth_1.login);
router.post("/forgotpassword", (0, validation_1.validate)(forgotPasswordValidation), auth_1.forgotPassword);
router.post("/verifyotp", (0, validation_1.validate)(verifyOTPValidation), auth_1.verifyOTP);
router.put("/resetpassword/:resettoken", (0, validation_1.validate)(resetPasswordValidation), auth_1.resetPassword);
// Protected routes
router.use(auth_2.protect); // Apply protect middleware to all routes below
router.get("/logout", auth_1.logout);
router.get("/me", auth_1.getMe);
router.put("/updatedetails", (0, validation_1.validate)(updateDetailsValidation), auth_1.updateDetails);
router.put("/updatepassword", (0, validation_1.validate)(updatePasswordValidation), auth_1.updatePassword);
exports.default = router;
