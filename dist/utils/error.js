"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_response_1 = require("../utils/error-response");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // Log to console for dev
    logger_1.default.error(err.stack);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new error_response_1.ErrorResponse(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = new error_response_1.ErrorResponse(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new error_response_1.ErrorResponse(message.join(", "), 400);
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        error = new error_response_1.ErrorResponse("Not authorized to access this route", 401);
    }
    if (err.name === "TokenExpiredError") {
        error = new error_response_1.ErrorResponse("Token expired, please login again", 401);
    }
    res.status(error.statusCode || 500).json(Object.assign({ success: false, error: error.message || "Server Error" }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
