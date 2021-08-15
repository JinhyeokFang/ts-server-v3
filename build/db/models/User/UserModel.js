"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    profileImageURL: { type: String, required: true },
    password: { type: String, required: true },
    iv: { type: String, required: true },
    key: { type: String, required: true },
});
const UserModel = mongoose_1.model('user', userSchema);
exports.UserModel = UserModel;
