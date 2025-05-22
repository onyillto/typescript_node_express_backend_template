"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
// import profileRoutes from "";
const router = express_1.default.Router();
// Base routes
router.use("/auth", auth_1.default);
// router.use("/profile", profileRoutes);
exports.default = router;
