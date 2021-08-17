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

class Server {
  private app = express();

  private port = 0;

  constructor() {
    dotenv.config();
    // .env로부터 설정 불러오기
    // 설정 불러오기에 실패하면 서버 종료
    try {
      this.port = parseInt(processEnv('PORT'), 10);
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
    this.routerSet();
  }

  private routerSet() {
    this.app.use(morgan('combined', { write: logger.info }));

    this.app.use(compression());
    this.app.use(helmet());
    this.app.disable('x-powered-by');
    this.app.use(cors());

    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ limit: '5mb', extended: false }));

    this.app.use('/static', express.static('./static'));

    this.app.use('/', new IndexController().router);
    this.app.use('/auth', new AuthController().router);

    this.app.set('views', './views');
    this.app.set('view engine', 'ejs');
    this.app.set('trust proxy', true);
  }

  public start() {
    this.app.listen(this.port, () => {
      logger.info(`Listening at http://localhost:${this.port}/`);
    });
  }
}

new Server().start();
