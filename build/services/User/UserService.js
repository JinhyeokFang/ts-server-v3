"use strict";
// createUser
// getUser
// removeUser
// editUser
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
const ts_response_1 = require("ts-response");
const validator_1 = __importDefault(require("validator"));
const UserModel_1 = require("../../db/models/User/UserModel");
const Crypto_1 = __importDefault(require("../../modules/Crypto"));
const logger_1 = __importDefault(require("../../modules/logger"));
class UserService {
    /**
     * Service 인스턴스 생성시 로그 작성
     */
    constructor() {
        logger_1.default.info('UserService Created');
    }
    /**
     * Service는 Singleton 패턴으로 작성
     */
    static getInstance() {
        if (UserService.instance == null)
            UserService.instance = new UserService();
        return UserService.instance;
    }
    /**
     * 유저 생성
     * @param  {string} username
     * @param  {string} password
     * @returns  {void}
     */
    createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 존재하는 유저인지 확인
            const userInstance = yield UserModel_1.UserModel.findOne({
                username,
            });
            if (userInstance) {
                throw new ts_response_1.ConflictError('이미 존재하는 유저입니다.');
            }
            if (!validator_1.default.isEmail(username)) {
                throw new ts_response_1.BadRequestError('username은 이메일만 가능합니다.');
            }
            if (!validator_1.default.isStrongPassword(password, {
                minLength: 8,
                minUppercase: 0,
                minNumbers: 1,
                minSymbols: 0,
            })) {
                throw new ts_response_1.BadRequestError('잘못된 비밀번호입니다.');
            }
            const key = yield Crypto_1.default.createKey();
            const encryptedPassword = yield Crypto_1.default.hash(password, key);
            const iv = yield Crypto_1.default.createIV();
            yield UserModel_1.UserModel.create({
                username, password: encryptedPassword, key, iv, profileImageURL: 'default_profile.jpg',
            });
        });
    }
    /**
     * 유저 로그인
     * @param  {string} username
     * @param  {string} password
     * @returns  {void}
     */
    loginUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 존재하는 유저인지 확인
            const userInstance = yield UserModel_1.UserModel.findOne({
                username,
            });
            if (!userInstance) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
            // 입력한 비밀번호 해시화 후 비교
            const encryptedPassword = yield Crypto_1.default.hash(password, userInstance.key);
            if (encryptedPassword !== userInstance.password) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
        });
    }
    /**
     * 유저 삭제
     * @param  {string} username
     * @param  {string} password
     * @returns  {void}
     */
    removeUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 존재하는 유저인지 확인
            const userInstance = yield UserModel_1.UserModel.findOne({
                username,
            });
            if (!userInstance) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
            // 입력한 비밀번호 해시화 후 비교
            const encryptedPassword = yield Crypto_1.default.hash(password, userInstance.key);
            if (encryptedPassword !== userInstance.password) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
            // 삭제
            userInstance.remove();
        });
    }
    /**
     * 유저 프로필 불러오기
     * @param  {string} username
     * @param  {string} password
     * @returns  {IUser}
     */
    getProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 존재하는 유저인지 확인
            const userInstance = yield UserModel_1.UserModel.findOne({
                username,
            });
            if (!userInstance) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
            return userInstance;
        });
    }
    /**
     * 유저 프로필 불러오기
     * @param  {string} username
     * @param  {string} password
     * @returns  {void}
     */
    setProfileImage(username, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 존재하는 유저인지 확인
            const userInstance = yield UserModel_1.UserModel.findOne({
                username,
            });
            if (!userInstance) {
                throw new ts_response_1.NotFoundError('유저를 찾을 수 없습니다.');
            }
            yield UserModel_1.UserModel.updateOne({ username }, { $set: { profileImageURL: filename } });
        });
    }
}
exports.default = UserService;
