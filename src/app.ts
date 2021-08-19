import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';

import DB from './db';
import JWT from './modules/JWT';
import Crypto from './modules/Crypto';
import processEnv from './modules/undefinedChecker';
import logger from './modules/logger';
import Server from './server';

dotenv.config();

if (!cluster.isWorker) {
  logger.info(`${process.pid} Primary 프로세스 시작`);

  const numOfCPUs = os.cpus().length;
  const numOfServerProcesses = parseInt(processEnv('NUM_OF_PROCESSES'), 10) || numOfCPUs;
  try {
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

  logger.info(`현재 컴퓨터의 코어 수는 ${numOfCPUs}개입니다.`);
  logger.info(`프로세스를 ${numOfServerProcesses}개 생성합니다.`);

  for (let i = 0; i < numOfServerProcesses; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', () => (worker) => {
    logger.error(`${worker.process.pid}번째 Worker가 종료되었습니다. 재시작합니다.`);
    cluster.fork();
  });
} else {
  try {
    logger.info(`${process.pid}번 서버 시작 시도`);
    new Server(parseInt(processEnv('PORT'), 10)).start();
  } catch (error) {
    (async () => {
      await logger.error(error);
      await logger.error('.env에서 PORT를 불러오기에 실패했습니다. 서버를 종료합니다.');
      process.exit();
    })();
  }
}