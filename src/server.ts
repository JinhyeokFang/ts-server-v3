import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import { randomUUID } from 'crypto';
import AuthController from './controllers/Auth/AuthController';
import PostController from './controllers/Post/PostController';
import CommentController from './controllers/Comment/CommentController';

import logger from './modules/logger';
import { BaseController } from './controllers/BaseController';
import initialize from './modules/Session';
import processEnv from './modules/undefinedChecker';

export default class Server {
  private app = express();

  private appInstance;

  private id: string;

  private port = 0;

  constructor(port = 3000) {
    this.id = randomUUID();
    this.port = port;
    initialize(this.app, 6379, 'localhost', processEnv('KEY'));
    this.appConfigSet();
    this.appRouterSet();
    this.appControllerSet([
      new AuthController(),
      new PostController(),
      new CommentController(),
    ]);
  }

  private appConfigSet() {
    // view engine set
    this.app.set('views', './views');
    this.app.set('view engine', 'ejs');
    this.app.set('trust proxy', true);
  }

  private appRouterSet() {
    // body parse
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ limit: '5mb', extended: false }));

    // winston, morgan 설정
    this.app.use(morgan('combined', { write: logger.info }));

    // 미들웨어 설정
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.disable('x-powered-by');

    // 정적 파일 호스팅
    this.app.use('/static', express.static('./static'));
    this.app.get('/uuid', (req, res) => {
      res.json({
        uuid: this.id,
      });
    });
  }

  private appControllerSet(controllers: BaseController[]) {
    for (let i = 0; i < controllers.length; i += 1) { // Controller는 Heavy하기 때문에 반드시 인덱스로 접근
      this.app.use(controllers[i].baseURL, controllers[i].router);
    }
  }

  public async start(): Promise<void> {
    this.appInstance = await this.app.listen(this.port);
    if (process.send) process.send('ready');
    logger.info('server started');
  }

  public async stop(): Promise<void> {
    await this.appInstance.close();
    logger.info('server closed');
  }

  public get rawServer(): Express.Application {
    return this.app;
  }
}
