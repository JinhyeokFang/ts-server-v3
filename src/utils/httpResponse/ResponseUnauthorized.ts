import { Response } from 'express';
import { ResponseFailedBody } from './ResponseBody';

export function responseUnauthorized(res: Response, body: ResponseFailedBody): void {
  res.status(401).json(body);
}

export class UnauthorizedError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}