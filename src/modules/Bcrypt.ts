import bcrypt from 'bcrypt';

export default class Bcrypt {
  private static saltRounds = 10;

  public static async createKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.saltRounds, (err, salt) => {
        if (err) reject(err);
        else resolve(salt);
      });
    });
  }

  public static async hash(value: string, saltKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(value, saltKey, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  }
}