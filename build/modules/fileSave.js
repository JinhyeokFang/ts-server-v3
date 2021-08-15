"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = exports.imageUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const ts_response_1 = require("ts-response");
const imageUpload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => cb(null, './files'),
        filename: (req, file, cb) => cb(null, crypto_1.default.randomBytes(32).toString('hex') + path_1.default.extname(file.originalname)),
    }),
    fileFilter(req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new ts_response_1.BadRequestError('이미지만 가능합니다.'));
        }
        return cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
function imageUploader(imageField) {
    return (req, res, next) => {
        imageUpload.single(imageField)(req, res, (error) => {
            if (error instanceof ts_response_1.BadRequestError) {
                ts_response_1.responseBadRequest(res, { errorMessage: error.message });
            }
            else if (error) {
                ts_response_1.responseInternalServerError(res, { errorMessage: error.message });
            }
            else {
                next();
            }
        });
    };
}
exports.imageUploader = imageUploader;
const fileUpload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => cb(null, './files'),
        filename: (req, file, cb) => cb(null, crypto_1.default.randomBytes(32).toString('hex') + path_1.default.extname(file.originalname)),
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
});
function fileUploader(fileField) {
    return (req, res, next) => {
        fileUpload.single(fileField)(req, res, (error) => {
            if (error) {
                ts_response_1.responseInternalServerError(res, { errorMessage: error.message });
            }
            else {
                next();
            }
        });
    };
}
exports.fileUploader = fileUploader;
