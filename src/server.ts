import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import AuthController from './controllers/Auth/AuthController';
// import PostController from './controllers/Post/PostController';
import logger from './modules/logger';

export default class Server {
  private app = express();

  private port = 0;

  constructor(port: number) {
    this.port = port;
    this.appConfigSet();
    this.appRouterSet();
  }

  private appConfigSet() {
    this.app.set('views', './views');
    this.app.set('view engine', 'ejs');
    this.app.set('trust proxy', true);
  }

  private appRouterSet() {
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ limit: '5mb', extended: false }));

    this.app.use(morgan('combined', { write: logger.info }));

    this.app.use(compression());
    this.app.use(helmet());
    this.app.disable('x-powered-by');
    this.app.use(cors());

    this.app.use('/static', express.static('./static'));

    this.app.use('/auth', new AuthController().router);
    // this.app.use('/post', new PostController().router);
  }

  public async start(): Promise<void> {
    await this.app.listen(this.port);
    logger.info(`${process.pid}번 서버 시작 완료 http://localhost:${this.port}/`);
  }
}
