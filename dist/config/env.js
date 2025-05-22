"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
// Define and export environment variables with types
const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    // MongoDB
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/app_name",
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
    // Email
    SMTP_HOST: process.env.SMTP_HOST || "smtp.mailtrap.io",
    SMTP_PORT: parseInt(process.env.SMTP_PORT || "2525", 10),
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
    FROM_EMAIL: process.env.FROM_EMAIL || "noreply@appname.com",
    FROM_NAME: process.env.FROM_NAME || "App Name",
    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    // File upload
    MAX_FILE_UPLOAD: parseInt(process.env.MAX_FILE_UPLOAD || "1000000", 10), // Default 1MB
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || "public/uploads",
};
exports.default = env;
