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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const IndexController_1 = __importDefault(require("./controllers/Index/IndexController"));
const AuthController_1 = __importDefault(require("./controllers/Auth/AuthController"));
const Crypto_1 = __importDefault(require("./modules/Crypto"));
const logger_1 = __importDefault(require("./modules/logger"));
const JWT_1 = __importDefault(require("./modules/JWT"));
const undefinedChecker_1 = __importDefault(require("./modules/undefinedChecker"));
dotenv_1.default.config();
const app = express_1.default();
let port = 0;
// .env로부터 설정 불러오기
// 설정 불러오기에 실패하면 서버 종료
try {
    port = parseInt(undefinedChecker_1.default('PORT'), 10);
    Crypto_1.default.setKey(undefinedChecker_1.default('KEY'));
    JWT_1.default.setKey(undefinedChecker_1.default('KEY'));
    db_1.default.initialize(undefinedChecker_1.default('DB_NAME'), parseInt(undefinedChecker_1.default('DB_PORT'), 10), undefinedChecker_1.default('DB_HOST'));
}
catch (error) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield logger_1.default.error(error);
        yield logger_1.default.error('.env에서 설정 불러오기에 실패했습니다. 서버를 종료합니다.');
        process.exit();
    }))();
}
app.use(morgan_1.default('combined', { write: logger_1.default.info }));
app.use(compression_1.default());
app.use(helmet_1.default());
app.disable('x-powered-by');
app.use(cors_1.default());
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: false }));
app.use('/static', express_1.default.static('./static'));
app.use('/', new IndexController_1.default().router);
app.use('/auth', new AuthController_1.default().router);
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.listen(port, () => {
    logger_1.default.info(`Listening at http://localhost:${port}/`);
});
