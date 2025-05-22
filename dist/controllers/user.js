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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const user_1 = require("../models/user");
const user_2 = require("../services/user");
const error_response_1 = require("../utils/error-response");
// @desc   Get all users
// @route  GET /api/v1/users
// @access Private/Admin
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = yield user_1.User.countDocuments();
        // Get users
        const users = yield user_1.User.find()
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);
        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        res.status(200).json({
            success: true,
            count: users.length,
            pagination,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
// @desc   Get single user
// @route  GET /api/v1/users/:id
// @access Private/Admin
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_2.UserService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
// @desc   Create user
// @route  POST /api/v1/users
// @access Private/Admin
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = (yield user_2.UserService.findUserByEmailOrUsername(email)) ||
            (yield user_2.UserService.findUserByEmailOrUsername(username));
        if (existingUser) {
            return next(new error_response_1.ErrorResponse("User already exists", 400));
        }
        // Create user
        const user = yield user_2.UserService.createUser({
            username,
            email,
            password,
            role,
        });
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
// @desc   Update user
// @route  PUT /api/v1/users/:id
// @access Private/Admin
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove password from request body
        const _a = req.body, { password } = _a, updateData = __rest(_a, ["password"]);
        const user = yield user_2.UserService.updateProfile(req.params.id, updateData);
        if (!user) {
            return next(new error_response_1.ErrorResponse("User not found", 404));
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access Private/Admin
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.User.findById(req.params.id);
        if (!user) {
            return next(new error_response_1.ErrorResponse("User not found", 404));
        }
        // Don't allow deleting own account
        if (user._id.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new error_response_1.ErrorResponse("Cannot delete own account", 400));
        }
        yield user.deleteOne();
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
