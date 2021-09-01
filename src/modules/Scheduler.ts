import schedule from 'node-schedule';
import logger from './logger';

// 초 분 시 일 월 요일
const job = schedule.scheduleJob('0 0 * * *', () => {
  logger.info('정각입니다.');
});
