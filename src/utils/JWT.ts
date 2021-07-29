import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export interface TokenData {
  isAccessToken: boolean,
  username: string
}

export default class JWT {
  private static privateKey = fs.readFileSync('private.key');

  public static async sign(isAccessToken: boolean, username: string): Promise<string> {
    const tokenData: TokenData = {
      isAccessToken: false,
      username,
    };
    const token: string = await jwt.sign(tokenData, this.privateKey, { expiresIn: isAccessToken ? '1d' : '1m' });
    return token;
  }

  public static async verify(token: string): Promise<TokenData> {
    const data: TokenData = await jwt.verify(token, this.privateKey);
    return data;
  }

  public static async checkAccessTokenMiddleware(req: Request,
    res: Response, next: NextFunction): Promise<void> {
    const token: string | string[] | undefined = req.headers.Authorization
     || req.headers.authorization;
    if (!token) {
      res.status(401).send({ success: false, errorMessage: '토큰이 요청 헤더에 존재하지 않습니다.' });
      return;
    }

    if (token instanceof Array) {
      res.status(400).send({ success: false, errorMessage: '토큰은 string[]이 아니라 string이어야 합니다.' });
      return;
    }

    try {
      const data: TokenData = await JWT.verify(token);
      if (!data.isAccessToken) {
        res.status(401).send({ success: false, message: 'AccessToken만 가능합니다.'});
        return;
      }
      res.locals.username = data.username;
      next();
    } catch (err) {
      res.status(401).send({ success: false, message: '잘못되었거나 만료된 토큰입니다.'});
    }
  }
}