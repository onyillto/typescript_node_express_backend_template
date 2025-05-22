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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
// MongoDB connection options
const options = {};
// Connect to MongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(process.env.MONGODB_URI ||
            "mongodb+srv://briteck:234-hire@cluster0.kmdtlvd.mongodb.net/", options);
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(`Error connecting to MongoDB: ${error.message}`);
        }
        else {
            logger_1.default.error("Unknown error connecting to MongoDB");
        }
        process.exit(1);
    }
});
exports.connectDB = connectDB;
// Handle MongoDB connection events
mongoose_1.default.connection.on("disconnected", () => {
    logger_1.default.warn("MongoDB disconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    logger_1.default.error(`MongoDB connection error: ${err}`);
});
// Handle application termination
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    logger_1.default.info("MongoDB connection closed due to app termination");
    process.exit(0);
}));
