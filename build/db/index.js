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
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../modules/logger"));
class DB {
    static initialize(dbname, dbport, host) {
        if (dbport)
            this.dbport = dbport;
        if (host)
            this.host = host;
        mongoose_1.default.connection.on('connected', () => {
            logger_1.default.info('DB가 연결되었습니다.');
            this.errorCount = 1;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.error('DB와의 연결이 중단되었습니다. 연결을 재시도합니다.');
            this.connect(dbname, this.dbport, this.host);
        });
        this.connect(dbname, this.dbport, this.host);
    }
    static connect(dbname, dbport, host) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.errorCount > 1)
                    logger_1.default.info(`DB 연결 재시도, ${this.errorCount}번째`);
                else
                    logger_1.default.info('DB 연결 시도');
                yield mongoose_1.default.connect(`mongodb://${host}:${dbport}/${dbname}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }
            catch (error) {
                logger_1.default.error(error);
                this.errorCount += 1;
                if (this.errorCount > 3) {
                    yield logger_1.default.error('DB 연결에 실패했습니다. 서버를 종료합니다.');
                    process.exit();
                }
                logger_1.default.error('DB에서 에러가 발생했습니다. 연결을 재시도합니다.');
                setTimeout(() => this.connect(dbname, this.dbport, this.host), 10000);
            }
        });
    }
}
exports.default = DB;
/**
 * MongoDB와 서버를 연결
 * 연결에 실패하거나 종료될 시 재연결
 * 세 번 연결 오류가 발생하면 서버를 종료
 * @param  {string} dbname
 * @param  {number} dbport
 * @param  {string} host
 */
DB.errorCount = 1;
DB.host = 'localhost';
DB.dbport = 27017;
