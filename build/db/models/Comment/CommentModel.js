"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
});
const CommentModel = mongoose_1.model('comment', commentSchema);
exports.CommentModel = CommentModel;
