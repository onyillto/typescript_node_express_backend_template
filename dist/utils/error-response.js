"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
// src/utils/error-response.ts
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Set prototype explicitly
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}
exports.ErrorResponse = ErrorResponse;
