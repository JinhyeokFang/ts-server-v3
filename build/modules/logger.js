"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
exports.default = winston_1.default.createLogger({
    transports: [
        new winston_daily_rotate_file_1.default({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs/info',
            filename: '%DATE%.log',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
        }),
        new winston_daily_rotate_file_1.default({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs/error',
            filename: '%DATE%.log',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
        }),
    ],
});
