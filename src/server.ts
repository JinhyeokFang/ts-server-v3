import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import AuthController from './controllers/Auth/AuthController';
import PostController from './controllers/Post/PostController';
import logger from './modules/logger';
import BaseController from './controllers/BaseController';

export default class Server {
  private app = express();

  private port = 0;

  constructor(port = 8080) {
    this.port = port;
    this.appConfigSet();
    this.appRouterSet();
    this.appControllerSet([
      new AuthController(),
      new PostController(),
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
  }

  private appControllerSet(controllers: BaseController[]) {
    for (let i = 0; i < controllers.length; i += 1) { // Controller는 Heavy하기 때문에 반드시 인덱스로 접근
      this.app.use(controllers[i].baseURL, controllers[i].router);
    }
  }

  public async start(): Promise<void> {
    await this.app.listen(this.port);
  }

  public get rawServer(): Express.Application {
    return this.app;
  }
}
