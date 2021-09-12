import dotenv from 'dotenv';

import { connectPrisma } from './db';
import JWT from './modules/JWT';
import Crypto from './modules/Crypto';
import processEnv from './modules/undefinedChecker';
import logger from './modules/logger';
import Server from './server';

dotenv.config();

try {
  Crypto.setKey(processEnv('KEY'));
  JWT.setKey(processEnv('KEY'));
  connectPrisma();
  new Server(parseInt(processEnv('PORT'), 10)).start();
} catch (error) {
  (async () => {
    await logger.error(error);
    await logger.error('.env에서 설정 불러오기에 실패했습니다. 서버를 종료합니다.');
    process.exit();
  })();
}
