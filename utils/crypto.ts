import { createCipheriv, createDecipheriv, Cipher, Decipher } from 'crypto';

export class Crypto {
    public static key: string;

    public static setKey(newKey: string): void {
        Crypto.key = newKey;
    }

    public static encrypt(data: string): string {
        const secretKeyToByteArray: Buffer = Buffer.from(Crypto.key.slice(0, 32));
        const iv: Buffer = Buffer.from(Crypto.key.slice(0, 16));
        const cipher: Cipher = createCipheriv("aes-256-cbc", secretKeyToByteArray, iv);
        let temp: string = cipher.update(data, "utf8", "base64");
        temp += cipher.final("base64");
        return temp;
    }

    public static decrypt(data: string): string {
        const secretKeyToByteArray: Buffer = Buffer.from(Crypto.key.slice(0, 32));
        const iv: Buffer = Buffer.from(Crypto.key.slice(0, 16));
        const decipher: Decipher = createDecipheriv("aes-256-cbc", secretKeyToByteArray, iv);
        let temp: string = decipher.update(data, "base64", "utf8");
        temp += decipher.final("utf8");
        return temp;
    }
}