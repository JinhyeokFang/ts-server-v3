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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ts_response_1 = require("ts-response");
class JWT {
    static setKey(newKey) {
        this.key = newKey;
    }
    static sign(isAccessToken, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = {
                isAccessToken,
                username,
            };
            const token = yield jsonwebtoken_1.default.sign(tokenData, this.key, { expiresIn: isAccessToken ? '1d' : '1m' });
            return token;
        });
    }
    static verify(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield jsonwebtoken_1.default.verify(token, this.key);
            return data;
        });
    }
    static checkAccessTokenMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.Authorization
                || req.headers.authorization;
            if (!token) {
                ts_response_1.responseUnauthorized(res, { errorMessage: '토큰이 요청 헤더에 존재하지 않습니다.' });
                return;
            }
            if (token instanceof Array) {
                ts_response_1.responseBadRequest(res, { errorMessage: '토큰은 string[]이 아니라 string이어야 합니다.' });
                return;
            }
            try {
                const data = yield JWT.verify(token);
                if (data.isAccessToken === false) {
                    ts_response_1.responseUnauthorized(res, { errorMessage: 'AccessToken만 가능합니다.' });
                    return;
                }
                res.locals.username = data.username;
                next();
            }
            catch (err) {
                ts_response_1.responseUnauthorized(res, { errorMessage: '잘못되었거나 만료된 토큰입니다.' });
            }
        });
    }
}
exports.default = JWT;
