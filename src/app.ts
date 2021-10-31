import Server from './server';
import { connectPrisma } from './db';
import JWT from './modules/JWT';
import Crypto from './modules/Crypto';
import processEnv from './modules/undefinedChecker';
import logger from './modules/logger';

async function runApp() {
  try {
    Crypto.setKey(processEnv('KEY'));
    JWT.setKey(processEnv('KEY'));
    connectPrisma();

    const server = await new Server(parseInt(processEnv('PORT'), 10));
    server.start();
    process.on('SIGINT', async () => {
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    await logger.error(error);
    await logger.error('.env에서 설정 불러오기에 실패했습니다. 서버를 종료합니다.');
    process.exit(0);
  }
}

runApp();
