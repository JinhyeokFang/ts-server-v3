import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import DB from './db';

import IndexRoute from './controllers/Index/IndexController';
import AuthRoute from './controllers/Auth/AuthController';
import Crypto from './utils/Crypto';
import Logger from './utils/Logger';

const app: express.Application = express();

dotenv.config();

const dbName = process.env.DB_NAME || 'dbdb';
const port = process.env.PORT || 8080;

Crypto.setKey(process.env.KEY || '');
DB.initialize(dbName);

app.use(morgan('combined', { write: Logger.info }));

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./static'));

app.use('/', IndexRoute);
app.use('/auth', AuthRoute);

app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port, (): void => {
  Logger.info(`Listening at http://localhost:${port}/`);
});
