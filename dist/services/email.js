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
exports.sendEmail = void 0;
// src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../utils/logger"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || "smtp.mailtrap.io",
        port: parseInt(process.env.SMTP_PORT || "2525", 10),
        auth: {
            user: process.env.SMTP_USER || "",
            pass: process.env.SMTP_PASSWORD || "",
        },
    });
    // Define email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || "234 Hire"} <${process.env.FROM_EMAIL || "noreply@appname.com"}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };
    try {
        // Send email
        const info = yield transporter.sendMail(mailOptions);
        logger_1.default.info(`Email sent: ${info.messageId}`);
    }
    catch (error) {
        logger_1.default.error(`Error sending email: ${error}`);
        throw error;
    }
});
exports.sendEmail = sendEmail;
