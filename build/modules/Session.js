"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const RedisStore = connect_redis_1.default(express_session_1.default);
// 반드시 세션으로 로그인 구현시 유저 정보에 ip를 함께 저장할 것.
function initialize(app, port, host, secret) {
    app.use(express_session_1.default({
        secret,
        httpOnly: true,
        secure: true,
        store: new RedisStore({
            client: redis_1.default.createClient(port, host),
            ttl: 200,
        }),
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            secure: true,
        },
    }));
}
exports.default = initialize;
