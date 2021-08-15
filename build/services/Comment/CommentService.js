"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../modules/logger"));
class CommentService {
    /**
     * Service 인스턴스 생성시 로그 작성
     */
    constructor() {
        logger_1.default.info('CommentService Created');
    }
    /**
     * Service는 Singleton 패턴으로 작성
     */
    static getInstance() {
        if (CommentService.instance == null)
            CommentService.instance = new CommentService();
        return CommentService.instance;
    }
}
exports.default = CommentService;
