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
