"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const passport_1 = __importDefault(require("passport"));
const error_response_1 = require("../utils/error-response");
const protect = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(new error_response_1.ErrorResponse("Not authorized to access this route", 401));
        }
        if (!user) {
            return next(new error_response_1.ErrorResponse("Not authorized to access this route", 401));
        }
        // Add user to request object
        req.user = user;
        next();
    })(req, res, next);
};
exports.protect = protect;
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        var _a;
        const user = req.user;
        if (!user) {
            return next(new error_response_1.ErrorResponse("User not found in request", 500));
        }
        if (!roles.includes(user.role)) {
            return next(new error_response_1.ErrorResponse(`User role '${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
