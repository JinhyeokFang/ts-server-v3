import mongoose from 'mongoose';

export default class DB {
  /**
   * MongoDB 연결
   * 다른 DB 추가 대비해 Class로 작성
   * @param  {string} dbname
   */
  public static initialize(dbname: string): void {
    mongoose.connect(`mongodb://localhost/${dbname}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
