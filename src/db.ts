import mongoose from 'mongoose';
import Logger from './utils/Logger';

export default class DB {
  /**
   * MongoDB 연결
   * 다른 DB 추가 대비해 Class로 작성
   * @param  {string} dbname
   * @param  {number} dbport
   * @param  {string} host
   */
  private static errorCount = 0;

  private static host = 'localhost';

  private static dbport = 27017;

  public static async initialize(dbname: string, dbport?: number, host?: string): Promise<void> {
    if (dbport) this.dbport = dbport;
    if (host) this.host = host;

    try {
      if (this.errorCount > 1) Logger.info('DB 연결 재시도');
      else Logger.info('DB 연결 시도');

      await mongoose.connect(`mongodb://${host}:${dbport}/${dbname}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      Logger.error(error);
      if (this.errorCount > 3) {
        Logger.error('DB 연결에 실패했습니다. 서버를 종료합니다.');
        process.exit();
      }
      Logger.error('DB에서 에러가 발생했습니다. 연결을 재시도합니다.');
      this.errorCount += 1;
      setTimeout(() => this.initialize(dbname, this.dbport, this.host), 10000);
    }

    mongoose.connection.on('connected', () => {
      Logger.info('DB가 연결되었습니다.');
      this.errorCount = 0;
    });

    mongoose.connection.on('disconnected', () => {
      Logger.error('DB와의 연결이 중단되었습니다. 연결을 재시도합니다.');
      this.initialize(dbname, this.dbport, this.host);
    });
  }
}
