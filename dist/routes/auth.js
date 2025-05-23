"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
// Add logging to see if routes are being set up
console.log("🛣️  Setting up auth routes");
// Register validation
const registerValidation = [
    (0, express_validator_1.body)("username")
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];
// Register route
router.post("/register", (req, res, next) => {
    console.log("🎯 Auth route /register hit!");
    next();
}, (0, validation_1.validate)(registerValidation), auth_1.register);
console.log("✅ Auth routes set up complete");
exports.default = router;
