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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Crypto {
    static setKey(newKey) {
        this.key = newKey;
    }
    static encrypt(data, iv) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKeyToByteArray = Buffer.from(Crypto.key.slice(0, 32));
            const cipher = crypto_1.createCipheriv('aes-256-cbc', secretKeyToByteArray, iv);
            let temp = cipher.update(data, 'utf8', 'base64');
            temp += cipher.final('base64');
            return temp;
        });
    }
    static decrypt(data, iv) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKeyToByteArray = Buffer.from(Crypto.key.slice(0, 32));
            const decipher = crypto_1.createDecipheriv('aes-256-cbc', secretKeyToByteArray, iv);
            let temp = decipher.update(data, 'base64', 'utf8');
            temp += decipher.final('utf8');
            return temp;
        });
    }
    static createKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                crypto_1.randomBytes(64, (err, buf) => {
                    if (err)
                        reject(err);
                    else
                        resolve(buf.toString('base64'));
                });
            });
        });
    }
    static createIV() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                crypto_1.randomBytes(16, (err, buf) => {
                    if (err)
                        reject(err);
                    else
                        resolve(buf);
                });
            });
        });
    }
    static hash(value, saltKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                crypto_1.pbkdf2(value, saltKey, 8282, 64, 'sha512', (err, key) => {
                    if (err)
                        reject(err);
                    else
                        resolve(key.toString('base64'));
                });
            });
        });
    }
}
exports.default = Crypto;
