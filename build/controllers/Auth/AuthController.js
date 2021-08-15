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
const ts_response_1 = require("ts-response");
const path_1 = __importDefault(require("path"));
const BaseController_1 = __importDefault(require("../BaseController"));
const UserService_1 = __importDefault(require("../../services/User/UserService"));
const JWT_1 = __importDefault(require("../../modules/JWT"));
const fileSave_1 = require("../../modules/fileSave");
class AuthController extends BaseController_1.default {
    constructor() {
        super();
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
        this.router.delete('/remove', this.remove);
        this.router.post('/refresh', this.refresh);
        this.router.use(JWT_1.default.checkAccessTokenMiddleware);
        this.router.get('/profile/image', this.getProfileImage);
        this.router.put('/profile', fileSave_1.imageUploader('profile'), this.patchProfile);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                yield UserService_1.default.getInstance().loginUser(username, password);
                ts_response_1.responseOK(res, {
                    data: {
                        accessToken: yield JWT_1.default.sign(true, username),
                        refreshToken: yield JWT_1.default.sign(false, username),
                    },
                });
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                yield UserService_1.default.getInstance().createUser(username, password);
                ts_response_1.responseOK(res, {});
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                yield UserService_1.default.getInstance().removeUser(username, password);
                ts_response_1.responseOK(res, {});
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            try {
                const tokenData = yield JWT_1.default.verify(refreshToken);
                if (tokenData.isAccessToken) {
                    throw new ts_response_1.ConflictError('RefreshToken만 가능합니다.');
                }
                const accessToken = yield JWT_1.default.sign(false, tokenData.username);
                ts_response_1.responseOK(res, { data: { accessToken } });
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
    getProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = res.locals;
            try {
                const data = yield UserService_1.default.getInstance().getProfile(username);
                ts_response_1.responseOKWithFile(res, path_1.default.join(__dirname, `../../../files/${data.profileImageURL}`));
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
    patchProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = res.locals;
            try {
                if (req.file === undefined) {
                    throw new ts_response_1.BadRequestError('프로필 사진을 추가해야합니다.');
                }
                const { filename } = req.file;
                yield UserService_1.default.getInstance().setProfileImage(username, filename);
                ts_response_1.responseOK(res, {});
            }
            catch (error) {
                ts_response_1.errorHandling(res, error);
            }
        });
    }
}
exports.default = AuthController;
