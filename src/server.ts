import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import DB from './db';

import IndexController from './controllers/Index/IndexController';
import AuthController from './controllers/Auth/AuthController';
import Crypto from './utils/Crypto';
import logger from './utils/logger';
import JWT from './utils/JWT';

import processEnv from './utils/undefinedChecker';

const app: express.Application = express();

dotenv.config();

let port = 0;

// .env로부터 설정 불러오기
// 설정 불러오기에 실패하면 서버 종료
try {
  port = parseInt(processEnv('PORT'), 10);
  Crypto.setKey(processEnv('KEY'));
  JWT.setKey(processEnv('KEY'));
  DB.initialize(processEnv('DB_NAME'), parseInt(processEnv('DB_PORT'), 10), processEnv('DB_HOST'));
} catch (error) {
  (async () => {
    await logger.error(error);
    await logger.error('.env에서 설정 불러오기에 실패했습니다. 서버를 종료합니다.');
    process.exit();
  })();
}

app.use(morgan('combined', { write: logger.info }));

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static('./static'));

app.use('/', new IndexController().router);
app.use('/auth', new AuthController().router);

app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port, (): void => {
  logger.info(`Listening at http://localhost:${port}/`);
});
