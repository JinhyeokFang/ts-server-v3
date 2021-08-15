"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processEnv(envName) {
    if (process.env[envName] === undefined) {
        throw Error(`process.env.${envName}가 undefined입니다.`);
    }
    return process.env[envName] || '';
}
exports.default = processEnv;
