import { Response } from 'express';
import { ResponseFailedBody } from './ResponseBody';

export function responseInternalServerError(res: Response, body: ResponseFailedBody): void {
  res.status(500).json(body);
}

export class InternalServerError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}