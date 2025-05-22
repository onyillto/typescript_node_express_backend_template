"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/logger.ts
const winston_1 = __importDefault(require("winston"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};
// Define colors for each level
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
};
// Add colors to Winston
winston_1.default.addColors(colors);
// Define the format for logs
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define transport channels
const transports = [
    // Console transport
    new winston_1.default.transports.Console(),
    // File transport for all logs
    new winston_1.default.transports.File({
        filename: "logs/all.log",
    }),
    // File transport for error logs
    new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
];
// Create the logger
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
exports.default = logger;
