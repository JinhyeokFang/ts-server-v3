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
import Logger from './utils/Logger';

const app: express.Application = express();

dotenv.config();

const port = process.env.PORT || 8080;

Crypto.setKey(process.env.KEY || '');
DB.initialize(process.env.DB_NAME || 'dbdb', 27017, process.env.DB_HOST);
// TODO: env에서 포트 불러오는 거로 교체 필요

app.use(morgan('combined', { write: Logger.info }));

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static('./files'));

app.use('/', new IndexController().router);
app.use('/auth', new AuthController().router);

app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port, (): void => {
  Logger.info(`Listening at http://localhost:${port}/`);
  console.log(`Listening at http://localhost:${port}/`);
});
