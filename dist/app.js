"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.connectDB)();
// Middleware
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log("📝 Request Body:", req.body);
    console.log("📋 Request Headers:", req.headers);
    next();
});
// Routes
app.use("/api/v1", routes_1.default);
// Add a simple test route
app.get("/test", (req, res) => {
    console.log("🎯 Test endpoint hit!");
    res.json({
        message: "Server is working!",
        timestamp: new Date().toISOString(),
    });
});
// Add another test for the API path
app.get("/api/v1/test", (req, res) => {
    console.log("🎯 API test endpoint hit!");
    res.json({
        message: "API route is working!",
        timestamp: new Date().toISOString(),
    });
});
// Error handling middleware
app.use((error, req, res, next) => {
    console.log("❌ Error caught:", error);
    console.log("📍 Error at:", req.method, req.path);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
