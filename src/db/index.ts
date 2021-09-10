import mongoose from 'mongoose';
import Logger from '../modules/logger';

export default class DB {
  private static errorCount = 1;

  /**
   * MongoDB와 서버를 연결
   * 연결에 실패하거나 종료될 시 재연결
   * 세 번 연결 오류가 발생하면 서버를 종료
   * @param  {string} dbname
   * @param  {number} dbport
   * @param  {string} host
   */
  public static initialize(dbUser, dbPass, dbName, dbPort, dbHost): void {
    mongoose.connection.on('connected', () => {
      Logger.info('DB가 연결되었습니다.');
      this.errorCount = 1;
    });

    mongoose.connection.on('disconnected', () => {
      Logger.error('DB와의 연결이 중단되었습니다. 연결을 재시도합니다.');
      this.connect(dbUser, dbPass, dbName, dbPort, dbHost);
    });

    this.connect(dbUser, dbPass, dbName, dbPort, dbHost);
  }

  private static async connect(dbUser: string, dbPass:string, dbName: string, dbPort = 27017, dbHost = 'localhost'): Promise<void> {
    try {
      if (this.errorCount > 1) Logger.info(`DB 연결 재시도, ${this.errorCount}번째`);
      else Logger.info('DB 연결 시도');

      await mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/admin`, {
        dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      Logger.error(error);
      this.errorCount += 1;
      if (this.errorCount > 3) {
        await Logger.error('DB 연결에 실패했습니다. 서버를 종료합니다.');
        process.exit();
      }
      Logger.error('DB에서 에러가 발생했습니다. 연결을 재시도합니다.');
      setTimeout(() => this.connect(dbUser, dbPass, dbName, dbPort, dbHost), 10000);
    }
  }
}
