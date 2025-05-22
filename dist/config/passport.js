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
// src/config/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
// Configure the JWT strategy for the passport
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "your_jwt_secret",
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user based on the JWT payload
        const user = yield user_1.User.findById(jwtPayload.id).select("-password");
        // If user doesn't exist, handle it
        if (!user) {
            return done(null, false);
        }
        // Otherwise, return the user
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
})));
// Configure the Local strategy for login
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "username" }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by username
        const user = yield user_1.User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: username.toLowerCase() },
            ],
        });
        // If no user is found, return false
        if (!user) {
            return done(null, false, { message: "Invalid credentials" });
        }
        // Check if the password is correct
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // If password doesn't match, return false
        if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
        }
        // If everything is OK, return the user
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
