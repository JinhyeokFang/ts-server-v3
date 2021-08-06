import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { responseBadRequest, responseUnauthorized } from 'ts-response';

export interface ITokenData extends Record<string, unknown> {
  isAccessToken: boolean,
  username: string
}

export default class JWT {
  public static key: string;

  public static setKey(newKey: string): void {
    this.key = newKey;
  }

  public static async sign(isAccessToken: boolean, username: string): Promise<string> {
    const tokenData: ITokenData = {
      isAccessToken,
      username,
    };
    const token: string = await jwt.sign(tokenData, this.key, { expiresIn: isAccessToken ? '1d' : '1m' });
    return token;
  }

  public static async verify(token: string): Promise<ITokenData> {
    const data: ITokenData = await jwt.verify(token, this.key);
    return data;
  }

  public static async checkAccessTokenMiddleware(req: Request,
    res: Response, next: NextFunction): Promise<void> {
    const token: string | string[] | undefined = req.headers.Authorization
     || req.headers.authorization;
    if (!token) {
      responseUnauthorized(res, { errorMessage: '토큰이 요청 헤더에 존재하지 않습니다.' });
      return;
    }

    if (token instanceof Array) {
      responseBadRequest(res, { errorMessage: '토큰은 string[]이 아니라 string이어야 합니다.' });
      return;
    }

    try {
      const data: ITokenData = await JWT.verify(token);
      if (data.isAccessToken === false) {
        responseUnauthorized(res, { errorMessage: 'AccessToken만 가능합니다.' });
        return;
      }
      res.locals.username = data.username;
      next();
    } catch (err) {
      responseUnauthorized(res, { errorMessage: '잘못되었거나 만료된 토큰입니다.' });
    }
  }
}
