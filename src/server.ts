import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import DB from './db';

import IndexController from './controllers/Index/IndexController';
import AuthController from './controllers/Auth/AuthController';
import Crypto from './modules/Crypto';
import logger from './modules/logger';
import JWT from './modules/JWT';

import processEnv from './modules/undefinedChecker';

dotenv.config();

const app = express();

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

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));

app.use('/static', express.static('./static'));

app.use('/', new IndexController().router);
app.use('/auth', new AuthController().router);

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}/`);
});
