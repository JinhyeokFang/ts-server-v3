import {
  createCipheriv, createDecipheriv, Cipher, Decipher, randomBytes, pbkdf2,
} from 'crypto';

export default class Crypto {
  public static key: string;

  public static setKey(newKey: string): void {
    this.key = newKey;
  }

  public static async encrypt(data: string, iv: Buffer): Promise<string> {
    const secretKeyToByteArray: Buffer = Buffer.from(Crypto.key.slice(0, 32));
    const cipher: Cipher = createCipheriv('aes-256-cbc', secretKeyToByteArray, iv);
    let temp: string = cipher.update(data, 'utf8', 'base64');
    temp += cipher.final('base64');
    return temp;
  }

  public static async decrypt(data: string, iv: Buffer): Promise<string> {
    const secretKeyToByteArray: Buffer = Buffer.from(Crypto.key.slice(0, 32));
    const decipher: Decipher = createDecipheriv('aes-256-cbc', secretKeyToByteArray, iv);
    let temp: string = decipher.update(data, 'base64', 'utf8');
    temp += decipher.final('utf8');
    return temp;
  }

  public static async createKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(64, (err, buf) => {
        if (err) reject(err);
        else resolve(buf.toString('base64'));
      });
    });
  }

  public static async createIV(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      randomBytes(16, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
  }

  public static async hash(value: string, saltKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      pbkdf2(value, saltKey, 8282, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        else resolve(key.toString('base64'));
      });
    });
  }
}
