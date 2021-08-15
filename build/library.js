var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// import winston from 'winston';
// import WinstonDaily from 'winston-daily-rotate-file';
// export default winston.createLogger({
//   transports: [
//     new WinstonDaily({
//       level: 'info',
//       datePattern: 'YYYY-MM-DD',
//       dirname: 'logs/info',
//       filename: '%DATE%.log',
//       maxSize: '20m',
//       maxFiles: '14d',
//       zippedArchive: true,
//     }),
//     new WinstonDaily({
//       level: 'error',
//       datePattern: 'YYYY-MM-DD',
//       dirname: 'logs/error',
//       filename: '%DATE%.log',
//       maxSize: '20m',
//       maxFiles: '14d',
//       zippedArchive: true,
//     }),
//   ],
// });
// createUser
// getUser
// removeUser
// editUser
